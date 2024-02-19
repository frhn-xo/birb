import Users from '../models/userModel.js';
import Verification from '../models/emailVerficationModel.js';
import {
  sendVerificationEmail,
  hashString,
  compareString,
  createJwt,
} from '../utils/auth.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error('Provide Required Fields!');
    }

    const userExist = await Users.findOne({ $or: [{ email }, { name }] });

    if (userExist && userExist.verified === true) {
      if (userExist.email === email) {
        throw new Error('Email Address already exists');
      } else {
        throw new Error('Name already exists');
      }
    } else if (userExist && userExist.verified === false) {
      await Users.findOneAndDelete({ _id: userExist._id });
    }

    const hashedPassword = await hashString(password.trim());
    const user = await Users.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    });
    sendVerificationEmail(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ message: 'Provide Required Fields!' });
    }

    const verificationRecord = await Verification.findOne({ email });

    if (!verificationRecord) {
      return res
        .status(404)
        .json({ message: 'Email not found in verification records' });
    }

    if (verificationRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    await Users.findOneAndUpdate({ email }, { verified: true });

    await Verification.findOneAndDelete({ email });

    return res.status(200).json({ message: 'Email verification successful' });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Provide User Credentials');
    }
    const user = await Users.findOne({ email }).select('+password').populate({
      path: 'friends inRequest outRequest',
      select: 'name image -password',
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user?.verified) {
      throw new Error('Your email is not verified. First, register.');
      return;
    }

    const isMatch = await compareString(password, user?.password);

    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    user.password = undefined;
    const token = createJwt(user?._id);

    res.status(201).json({
      success: true,
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
