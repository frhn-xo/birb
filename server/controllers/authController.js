import Users from '../models/userModel.js';

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

    const userExist = await Users.findOne({ email });
    if (userExist) {
      throw new Error('Email Address already exists');
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Provide User Credentials');
    }
    const user = await Users.findOne({ email })
      .select('+password')
      .populate({ path: 'friends', select: 'name bio image -password' });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // if (!user?.verified) {
    //   next('User email is not verified. Check your email.');
    //   return;
    // }

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
