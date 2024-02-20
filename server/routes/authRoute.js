import express from 'express';
import {
  login,
  register,
  verifyEmail,
  resetPassword,
  newPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyEmail);
router.post('/reset-password', resetPassword);
router.post('/new-password', newPassword);

export default router;
