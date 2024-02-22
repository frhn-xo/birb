import Users from '../models/userModel.js';
import { createJwt } from '../utils/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const getUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const user = await Users.findById(id ?? userId).populate({
      path: 'friends inRequest outRequest',
      select: 'name image -password',
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

export const updateUser = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const { userId } = req.user;

    if (!(name || bio || req?.file)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const existingUserWithUpdatedName = await Users.findOne({
      _id: { $ne: userId },
      name: name?.trim(),
    });

    if (existingUserWithUpdatedName) {
      return res.status(400).json({
        success: false,
        message: 'Given name is already in use by another user',
      });
    }

    const user = await Users.findById(userId);

    // console.log(user);

    let image = user.image ?? null;
    let publicId = user.publicId ?? null;

    if (req?.file) {
      if (user?.publicId) {
        await cloudinary.uploader.destroy(user.publicId, (error, result) => {
          if (error) {
            console.error('Error deleting image:', error);
          } else {
            console.log('Image deleted successfully:', result);
          }
        });
      }

      const bufferImageData = req.file.buffer;

      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const uploadOptions = {
            folder: 'birb',
            resource_type: 'image',
            quality: 'auto',
          };

          cloudinary.uploader
            .upload_stream(uploadOptions, (error, cloudinaryResult) => {
              if (error) {
                console.error(error);
                reject('Error uploading image to Cloudinary.');
              } else {
                // console.log(cloudinaryResult);
                image = cloudinaryResult.secure_url;
                publicId = cloudinaryResult.public_id;
                resolve();
              }
            })
            .end(bufferImageData);
        });
      };

      await uploadToCloudinary();
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

    await updatedUser.populate({
      path: 'friends inRequest outRequest',
      select: 'name image -password',
    });

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

export const friendRequest = async (req, res) => {
  try {
    const { userId } = req.user;
    const { requestTo } = req.body;

    const requestedUser = await Users.findById(requestTo);
    if (!requestedUser) {
      return res
        .status(404)
        .json({ message: 'Requested user not found', success: false });
    }

    if (userId == requestedUser._id) {
      return res.status(400).json({
        message: 'Cannot send friend request to oneself',
        success: false,
      });
    }

    if (requestedUser.inRequest.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'Friend request already sent', success: false });
    }

    if (requestedUser.friends.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'Users are already friends', success: false });
    }

    if (requestedUser.outRequest.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'Friend request already received', success: false });
    }

    requestedUser.inRequest.push(userId);
    await requestedUser.save();

    const currentUser = await Users.findById(userId);
    currentUser.outRequest.push(requestTo);
    await currentUser.save();

    res
      .status(200)
      .json({ message: 'Friend request sent successfully', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const { userId } = req.user;

    const currentUser = await Users.findById(userId);

    if (!currentUser) {
      return res
        .status(404)
        .json({ message: 'User not found', success: false });
    }

    const inRequestDetails = await Users.find({
      _id: { $in: currentUser.inRequest },
    })
      .select('-password name image')
      .exec();

    res.status(200).json({ inRequest: inRequestDetails, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { requestBy, status } = req.body;

    const requestingUser = await Users.findById(requestBy);
    if (!requestingUser) {
      return res
        .status(404)
        .json({ message: 'Requesting user not found', success: false });
    }

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Status can be "Accepted" or "Rejected"',
        success: false,
      });
    }

    if (!requestingUser.outRequest.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'Friend request not found', success: false });
    }

    const currentUser = await Users.findById(userId);

    const index = currentUser.inRequest.indexOf(requestBy);
    if (index !== -1) {
      currentUser.inRequest.splice(index, 1);
    }

    const indexOutRequest = requestingUser.outRequest.indexOf(userId);

    if (indexOutRequest !== -1) {
      requestingUser.outRequest.splice(indexOutRequest, 1);
    }

    if (status === 'Accepted') {
      currentUser.friends.push(requestBy);
      requestingUser.friends.push(userId);
    }

    await currentUser.save();
    await requestingUser.save();

    res.status(200).json({
      message: `Friend request ${status.toLowerCase()} successfully`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', success: false });
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
