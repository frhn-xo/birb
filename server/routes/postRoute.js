import express from 'express';
import userAuth from '../middlewares/authMiddleware.js';
import { diskUpload } from '../utils/diskUpload.js';
import {
  createPost,
  deletePost,
  getPosts,
  getUserPosts,
  commentPost,
  likePost,
  getCommentPost,
} from '../controllers/postController.js';

const router = express.Router();

router.post('/create-post', userAuth, diskUpload.single('image'), createPost);
router.get('/', userAuth, getPosts);
router.get('/get-user-post/:id', userAuth, getUserPosts);

router.put('/like/:id', userAuth, likePost);

router.put('/get-comment/:id', userAuth, getCommentPost);

router.put('/comment/:id', userAuth, commentPost);

router.delete('/:id', userAuth, deletePost);

export default router;
