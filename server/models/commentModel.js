import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    postId: { type: Schema.Types.ObjectId, ref: 'Posts' },
    comment: { type: String, required: true },
    from: { type: String, required: true },
    likes: [{ type: String }],
  },
  { timestamps: true }
);

const Comments = mongoose.model('Comments', commentSchema);

export default Comments;
