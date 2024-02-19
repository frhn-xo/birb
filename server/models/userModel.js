import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is Required!'],
      unique: [true, 'User with same name already exists'],
    },
    email: {
      type: String,
      required: [true, 'Email is Required!'],
      unique: [true, 'User with the same email already exists'],
    },
    password: {
      type: String,
      required: [true, 'Password is Required!'],
      select: true,
    },
    bio: {
      type: String,
      maxlength: [150, 'Bio should not exceed 150 characters'],
    },
    image: { type: String },
    publicId: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    views: [{ type: String }],
    verified: { type: Boolean, default: false },
    inRequest: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    outRequest: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  },
  { timestamps: true }
);

const Users = mongoose.model('Users', userSchema);

export default Users;
