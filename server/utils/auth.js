import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Verification from '../models/emailVerficationModel.js';

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

// email verification

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

export const sendVerificationEmail = async (user, res) => {
  const { _id, email, name } = user;
  const token = _id + crypto.randomUUID();
  const link = `${process.env.APP_URL}users/verify/${_id}/${token}`;

  console.log(email, process.env.AUTH_EMAIL, process.env.AUTH_PASSWORD);

  const mailOptions = {
    to: email,
    subject: 'Birb Email Verification',
    html: `<div
    style='font-family: sans-serif; font-size: 20px; color: #a3bffa; background-color: #000; padding: 20px; border-radius: 30px;
    text-align: center; padding-bottom:30px'>
    <p style="font-size: 15px; color: aliceblue; text-align: center;">birb</p>
<h3 style="
    font-weight: bold;
    width: 100%;
    font-size: 25px
  ">Let's verify your account ${name} 🐤</h3>
    <hr>
    <br>
    <a href=${link}
        style="font-weight: bold; color: aliceblue; padding: 14px; text-decoration: none; background-color: #3c366b;  border-radius: 8px; font-size: 15px;">verify</a>
    <br>
    <h3 style="
    font-weight: bold;
    width: 100%;
    font-size: 18px
  ">click on the button, obv...</h3>
</div>
`,
  };

  try {
    const hashedToken = await hashString(token);
    const newVerifiedEmail = await Verification.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

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

// reset password
