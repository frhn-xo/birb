import express from 'express';
import path from 'path';
import {
  verifyEmail,
  getUser,
  updateUser,
  friendRequest,
  getFriendRequest,
  acceptRequest,
  suggestedFriends,
  profileViews,
  search,
} from '../controllers/userController.js';
import userAuth from '../middlewares/authMiddleware.js';
import { diskUpload } from '../utils/diskUpload.js';

const router = express.Router();
const __dirname = path.resolve(path.dirname(''));

router.get('/verify/:userId/:token', verifyEmail);
router.get('/verified', (req, res) => {
  res.sendFile(path.join(__dirname, './views/verifiedpage.html'));
});

router.get('/get-user/:id?', userAuth, getUser);
router.put('/update-user', userAuth, diskUpload.single('image'), updateUser);

router.get('/search', userAuth, search);

router.post('/friend-request', userAuth, friendRequest);
router.post('/get-friend-request', userAuth, getFriendRequest);
router.post('/accept-request', userAuth, acceptRequest);
router.post('/profile-view', userAuth, profileViews);
router.post('/suggested-friends', userAuth, suggestedFriends);

export default router;
