import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Verification = mongoose.model('Verification', emailSchema);

const PasswordReset = mongoose.model('Verification', emailSchema);

export { Verification, PasswordReset };
