import express from 'express';
import userAuth from '../middlewares/authMiddleware.js';
import { upload } from '../utils/memoryUpload.js';
import {
  createPost,
  deletePost,
  getPosts,
  getUserPosts,
  commentPost,
  likePost,
  getCommentPost,
  getSinglePost,
} from '../controllers/postController.js';

const router = express.Router();

router.get('/', userAuth, getPosts);

router.get('/:id', userAuth, getSinglePost);

router.post('/create-post', userAuth, upload.single('image'), createPost);

router.get('/get-user-post/:id', userAuth, getUserPosts);

router.put('/like/:id', userAuth, likePost);

router.get('/get-comment/:id', userAuth, getCommentPost);

router.put('/comment/:id', userAuth, commentPost);

router.delete('/:id', userAuth, deletePost);

export default router;
