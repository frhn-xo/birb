import Posts from '../models/postModel.js';
import Users from '../models/userModel.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const createPost = async (req, res, next) => {
  let image = req.file;
  try {
    const { userId } = req.user;
    const { description } = req.body;

    if (!description) {
      return res
        .status(400)
        .json({ message: 'You must provide a description' });
    }

    let publicId = null;

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image.path, {
        folder: 'birb',
        quality: 'auto',
      });
      fs.unlinkSync(`uploads/${image.filename}`);
      image = uploadedResponse.secure_url;
      publicId = uploadedResponse.public_id;
      console.log('public id ', publicId);
    }

    const post = await Posts.create({
      userId,
      description: description.trim(),
      image,
      publicId,
    });

    res.status(200).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    if (image) {
      fs.unlinkSync(`uploads/${image.filename}`);
    }
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { search } = req.body;

    const user = await Users.findById(userId);
    const friends = user?.friends?.toString().split(',') ?? [];
    friends.push(userId);

    const searchPostQuery = {
      $or: [
        {
          description: { $regex: search, $options: 'i' },
        },
      ],
    };

    const posts = await Posts.find(search ? searchPostQuery : {})
      .populate({
        path: 'userId',
        select: 'name bio profileUrl -password',
      })
      .sort({ _id: -1 })
      .limit(100);

    const friendsPosts = [];
    const otherPosts = [];

    posts?.forEach((post) => {
      const postUserId = post?.userId?._id.toString();

      if (friends.includes(postUserId)) {
        friendsPosts.push(post);
      } else {
        otherPosts.push(post);
      }
    });

    res.status(200).json({
      success: true,
      message: 'got posts successfully',
      data: [...friendsPosts, ...otherPosts],
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Posts.find({ userId: id })
      .populate({
        path: 'userId',
        select: 'name bio -password',
      })
      .sort({ _id: -1 });

    res.status(200).json({
      sucess: true,
      message: 'got user post successfully',
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const likePost = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const post = await Posts.findById(id);

    const index = post.likes.findIndex((pid) => pid === String(userId));

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((pid) => pid !== String(userId));
    }

    const newPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: 'liked post successfully',
      data: newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    const deletedPost = await Posts.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (deletedPost?.publicId) {
      cloudinary.uploader.destroy(deletedPost.publicId, (error, result) => {
        if (error) {
          console.error('Error deleting image:', error);
        } else {
          console.log('Image deleted successfully:', result);
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deleted successfully',
      deletedPost: deletedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
