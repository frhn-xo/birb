import Posts from '../models/postModel.js';
import Users from '../models/userModel.js';
import Comments from '../models/commentModel.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

export const createPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { description } = req.body;

    if (!description) {
      return res
        .status(400)
        .json({ message: 'You must provide a description' });
    }

    let image = null;
    let publicId = null;

    if (req?.file) {
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
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await Users.findById(userId);
    const friends = user?.friends?.toString().split(',') ?? [];
    friends.push(userId);

    const posts = await Posts.find()
      .populate('userId')
      .sort({ _id: -1 })
      .limit(300);

    const friendsPosts = [];
    const otherPosts = [];

    posts?.forEach((post) => {
      const postUserId = post?.userId?._id.toString();

      if (postUserId != userId || friends.includes(postUserId)) {
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
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Posts.findById(id);
    res.status(200).json({
      success: true,
      message: 'got posts successfully',
      data: post,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ success: false, message: error.message })
      .populate('userId');
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Posts.find({ userId: id })
      .populate({
        path: 'userId',
        select: 'name bio image -password',
      })
      .sort({ _id: -1 })
      .limit(300);

    res.status(200).json({
      sucess: true,
      message: 'got user post successfully',
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const post = await Posts.findById(id);

    const index = post.likes.findIndex((pid) => pid === String(userId));

    let action = '';

    if (index === -1) {
      post.likes.push(userId);
      action = 'liked';
    } else {
      post.likes = post.likes.filter((pid) => pid !== String(userId));
      action = 'unliked';
    }

    const newPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: `${action} post successfully`,
      data: newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: error.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { comment } = req.body;
    if (!comment) {
      throw new Error('Provide comment field!');
    }

    const post = await Posts.findById(id);
    if (!post) {
      throw new Error('Post not found!');
    }

    const newComment = new Comments({
      userId,
      postId: post._id,
      comment,
    });

    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getCommentPost = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comments.find({ postId: id })
      .populate({
        path: 'userId',
        select: 'name image -password',
      })
      .sort({ _id: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
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

    await Comments.deleteMany({ postId: id });

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
    res.status(404).json({ success: false, message: error.message });
  }
};
