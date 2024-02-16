import mongoose from 'mongoose';
import Verification from '../models/emailVerficationModel.js';
import Users from '../models/userModel.js';
import PasswordReset from '../models/passwordResetModel.js';
import FriendRequest from '../models/friendRequestModel.js';
import { compareString, createJwt } from '../utils/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;
  try {
    const result = await Verification.findOne({ userId });
    if (result) {
      const { expiresAt, token: hashedToken } = result;
      if (expiresAt < Date.now()) {
        Verification.findOneAndDelete({ userId })
          .then(() => {
            Users.findOneAndDelete({ _id: userId })
              .then(() => {
                const message = 'Verification token has expired.';
                res.redirect(`/users/verified?status=error&message=${message}`);
              })
              .catch((error) => {
                res.redirect(`/users/verified?status=error&message=`);
              });
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/users/verified?message=`);
          });
      } else {
        compareString(token, hashedToken)
          .then((isMatch) => {
            if (isMatch) {
              Users.findOneAndUpdate({ _id: userId }, { verified: true })
                .then(() => {
                  Verification.findOneAndDelete({ userId }).then(() => {
                    const message = 'Email verified successfully';
                    res.redirect(
                      `/users/verified?status=success&message=${message}`
                    );
                  });
                })
                .catch((error) => {
                  console.log(error);
                  const message = 'Verification failed or link is invalid';
                  res.redirect(
                    `/users/verified?status=error&message=${message}`
                  );
                });
            } else {
              const message = 'Verification failed or link is invalid';
              res.redirect(`/users/verified?status=error&message=${message}`);
            }
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/users/verified?message=`);
          });
      }
    } else {
      const message = 'Invalid verification link. Try again later.';
      res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// export const requestPasswordReset = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await Users.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         status: 'FAILED',
//         message: 'Email address not found',
//       });
//     }

//     const existingRequest = await PasswordReset.findOne({ email });

//     if (existingRequest) {
//       if (existingRequest.expiresAt > Date.now()) {
//         return res.status(201).json({
//           status: 'PENDING',
//           message: 'Reset password link has already been sent to yo email',
//         });
//       }
//       await PasswordReset.findOneAndDelete({ email });
//     }
//     await resetPasswordLink(user, res);
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: error.message });
//   }
// };

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const user = await Users.findById(id ?? userId).populate({
      path: 'friends',
      select: '-password',
    });

    if (!user) {
      return res.status(200).send({
        message: 'User Not Found',
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'auth error',
      success: false,
      error: error.message,
    });
  }
};

export const search = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Username is empty' });
    }

    const queryObject = { name: { $regex: name, $options: 'i' } };

    const queryResult = Users.find(queryObject)
      .limit(300)
      .select('name bio image -password');

    const searchFriends = await queryResult;

    res.status(200).json({
      success: true,
      data: searchFriends,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateUser = async (req, res, next) => {
  let image = req.file;
  try {
    const { name, bio } = req.body;
    const { userId } = req.user;

    if (!(name || bio || image)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    let publicId = null;

    const user = await Users.findById(userId);

    if (image) {
      if (user?.publicId) {
        await cloudinary.uploader.destroy(user.publicId, (error, result) => {
          if (error) {
            console.error('Error deleting image:', error);
          } else {
            console.log('Image deleted successfully:', result);
          }
        });
      }

      const uploadedResponse = await cloudinary.uploader.upload(image.path, {
        folder: 'birb',
        quality: 'auto',
      });
      fs.unlinkSync(`uploads/${image.filename}`);
      image = uploadedResponse.secure_url;
      publicId = uploadedResponse.public_id;
    }

    const updateUser = {
      name: name?.trim(),
      bio: bio?.trim(),
      _id: userId,
      image,
      publicId,
    };

    const updatedUser = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    await updatedUser.populate({ path: 'friends', select: '-password' });

    const token = createJwt(updatedUser?._id);

    updatedUser.password = undefined;
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const friendRequest = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const { requestTo } = req.body;

    const requestExist = await FriendRequest.findOne({
      requestFrom: userId,
      requestTo,
    });

    if (requestExist) {
      next('Friend Request already sent.');
      return;
    }

    const oppositeRequestExist = await FriendRequest.findOne({
      requestFrom: requestTo,
      requestTo: userId,
    });

    if (oppositeRequestExist) {
      next('Friend Request already exists.');
      return;
    }

    const areAlreadyFriends = await Users.findOne({
      _id: userId,
      friends: requestTo,
    });

    if (areAlreadyFriends) {
      next('Users are already friends.');
      return;
    }

    const newRes = await FriendRequest.create({
      requestTo,
      requestFrom: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Friend Request sent successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'auth error',
      success: false,
      error: error.message,
    });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const { userId } = req.user;

    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: 'Pending',
    })
      .populate({
        path: 'requestFrom',
        select: 'name image bio -password',
      })
      .limit(10)
      .sort({
        _id: -1,
      });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'auth error',
      success: false,
      error: error.message,
    });
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const id = req.user.userId;

    const { rid, status } = req.body;

    const requestExist = await FriendRequest.findById(rid);

    if (!requestExist) {
      next('No Friend Request Found.');
      return;
    }

    const newRes = await FriendRequest.findByIdAndDelete({ _id: rid });

    if (status === 'Accepted') {
      const user = await Users.findById(id);

      user.friends.push(newRes?.requestFrom);

      await user.save();

      const friend = await Users.findById(newRes?.requestFrom);

      friend.friends.push(newRes?.requestTo);

      await friend.save();
    }

    res.status(201).json({
      success: true,
      message: 'Friend Request ' + status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'auth error',
      success: false,
      error: error.message,
    });
  }
};

export const profileViews = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.body;

    const user = await Users.findById(id);
    console.log(user);
    user.views.push(userId);

    await user.save();

    res.status(201).json({
      success: true,
      message: 'viewed profile Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'auth error',
      success: false,
      error: error.message,
    });
  }
};

export const suggestedFriends = async (req, res) => {
  try {
    const { userId } = req.user;

    let queryObject = {};

    queryObject._id = { $ne: userId };

    queryObject.friends = { $nin: userId };

    let queryResult = Users.find(queryObject)
      .limit(15)
      .select('name bio image -password');

    const suggestedFriends = await queryResult;

    res.status(200).json({
      success: true,
      data: suggestedFriends,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
