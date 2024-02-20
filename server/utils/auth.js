import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  Verification,
  PasswordReset,
} from '../models/emailVerficationModel.js';

// jwt and bcrypt hashing

export const hashString = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  return hashedpassword;
};

export const compareString = async (userPassword, password) => {
  const isMatch = await bcrypt.compare(userPassword, password);
  return isMatch;
};

export const createJwt = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET);
};

// email

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'frhndevauth@gmail.com',
    pass: 'ylyeplrfmxbaaulq',
  },
});

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

export const sendVerificationEmail = async (user, res) => {
  try {
    const { email, name } = user;
    const otp = generateOTP();

    await Verification.findOneAndDelete({ email });

    const newVerifiedEmail = new Verification({
      email,
      otp,
    });

    await newVerifiedEmail.save();

    const mailOptions = {
      to: email,
      subject: 'Birb Email Verification',
      html: `
          <div>
      <div
      style="
        font-family: sans-serif;
        font-size: 20px;
        color: #a3bffa;
        background-color: #000;
        padding: 20px;
        border-radius: 30px;
        text-align: center;
        padding-bottom: 30px;
      "
    >
      <p style="font-size: 15px; color: #f0f8ff; text-align: center">birb</p>
      <h3 style="font-weight: bold; width: 100%; font-size: 25px; color:#f5d0fe
      ">
        Your OTP's here, "${name}"
      </h3>
      <hr />
      <br />
      <div
        style="
          font-weight: bold;
          color: aliceblue;
          padding: 14px;
          text-decoration: none;
          background-color: #3c366b;
          border-radius: 8px;
          font-size: 20px;
        "
      >
        ${otp}
      </div>
      <br />
      <h3 style="font-weight: bold; width: 100%; font-size: 18px">
        🐤 thank me later, brrrr...
        
      </h3>
    </div>
`,
    };

    if (newVerifiedEmail) {
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: 'PENDING',
            message: 'Verification email has been sent to your account.',
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ message: 'Something went wrong' });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: 'somethng went wrong' });
  }
};

export const sendResetPasswordEmail = async (user, res) => {
  try {
    const { email, name } = user;
    const otp = generateOTP();

    await PasswordReset.findOneAndDelete({ email });

    const newPasswordReset = new PasswordReset({
      email,
      otp,
    });

    await newPasswordReset.save();

    const mailOptions = {
      to: email,
      subject: 'Birb Email PasswordReset',
      html: `
<div>
      <div
      style="
        font-family: sans-serif;
        font-size: 20px;
        color: #a3bffa;
        background-color: #000;
        padding: 20px;
        border-radius: 30px;
        text-align: center;
        padding-bottom: 30px;
      "
    >
      <p style="font-size: 15px; color: #f0f8ff; text-align: center">birb</p>
      <h3 style="font-weight: bold; width: 100%; font-size: 25px; color:#f5d0fe
      ">
        Your OTP's here, "${name}"
      </h3>
      <hr />
      <br />
      <div
        style="
          font-weight: bold;
          color: aliceblue;
          padding: 14px;
          text-decoration: none;
          background-color: #3c366b;
          border-radius: 8px;
          font-size: 20px;
        "
      >
        ${otp}
      </div>
      <br />
      <h3 style="font-weight: bold; width: 100%; font-size: 18px">
        🐤 forgot your password? hmm...
        
      </h3>
    </div>
`,
    };

    if (newPasswordReset) {
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: 'PENDING',
            message: 'Password reset OTP has been sent to your email.',
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ message: 'Something went wrong' });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: 'somethng went wrong' });
  }
};
