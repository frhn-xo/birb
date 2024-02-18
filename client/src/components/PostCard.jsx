import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';
import { postComments } from '../assets/data';
import moment from 'moment';
import { BiSolidHeart, BiHeart, BiComment } from 'react-icons/bi';
import { MdOutlineDelete } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { CustomButton, TextInput } from '../components';
import { apiRequest } from '../utils';

const CommentForm = ({ user, id, replyAt, getComments }) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, serErrMsg] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  const onSubmit = async (data) => {};
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border-indigo-950 text-slate-300 "
    >
      <div className="w-full flex items-center gap-2 py-4 px-2">
        <img
          src={user?.image ?? NoProfile}
          alt="User Image"
          className="w-6 h-6 rounded-full object-cover"
        />
        <TextInput
          name="comment"
          styles="w-full rounded-full ring-indigo-950 h-9"
          placeholder={replyAt ? `Reply @${replyAt}` : '....comment on this'}
          register={register('comment', { required: 'Comment is empty' })}
          error={errors.comment ? errors.comment.message : ''}
        />
      </div>
      {errMsg?.message && (
        <span
          role="alert"
          className={`text-sm ${
            errMsg?.status == 'failed'
              ? 'text-red-500 text-xs mt-1'
              : 'text-green-500 text-xs mt-1'
          }mt-0.5`}
        >
          {errMsg?.message}
        </span>
      )}
      <div className="flex items-end justify-end pb-2">
        {loading ? (
          '....loading'
        ) : (
          <CustomButton
            title="Reply"
            containerStyles="justify-center bg-indigo-950 hover:text-slate-300 rounded-lg hover:bg-indigo-700 py-1.5 px-5 text-sm"
          />
        )}
      </div>
    </form>
  );
};

const PostCard = ({ post, user, deletePost }) => {
  const [showAll, setShowAll] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const [like, setLike] = useState(post?.likes?.includes(user?._id));

  const likePost = async () => {
    setLike((p) => !p);
    try {
      const like = await apiRequest({
        url: `/posts/like/${post._id}`,
        method: 'put',
        token: user.token,
      });

      if (!like.data.success) {
        setLike((p) => !p);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getComments = async () => {
    setReplyComments(0);
    setComments(postComments);
    setLoading(false);
  };

  return (
    <div
      className="bg-black px-4
    pb-5 pt-3"
    >
      <div className="flex gap-3 items-center mb-2">
        <Link to={`/profile/${post?.userId?._id}`}>
          <img
            src={post?.userId?.image ?? NoProfile}
            alt=""
            className="w-10 h-10 object-cover rounded-full m-1"
          />
        </Link>
        <div className="w-full flex justify-between">
          <div className="">
            <Link to={`/profile/${post?.userId?._id}`}>
              <p className="font-medium text-md">{post?.userId.name}</p>
            </Link>
          </div>
          <span className="text-xs opacity-50">
            {moment(post?.createdAt ?? '2023-05-25').fromNow()}
          </span>
        </div>
      </div>
      <div>
        <p className="text-md pb-0.5">
          {showAll === post?._id
            ? post?.description
            : post?.description.slice(0, 300)}

          {post?.description?.length > 301 &&
            (showAll === post?._id ? (
              <span
                className="text-xs px-3 text-indigo-300 hover:cursor-pointer"
                onClick={() => setShowAll(0)}
              >
                Show Less
              </span>
            ) : (
              <span
                className="text-xs px-3 text-indigo-300 hover:cursor-pointer"
                onClick={() => setShowAll(post?._id)}
              >
                Show More
              </span>
            ))}
        </p>
        {post?.image && (
          <img
            src={post?.image}
            alt="post image"
            className=" w-full max-h-96 sm:max-h-full object-cover my-3 rounded-lg"
          />
        )}
      </div>
      <div className="mt-4 flex justify-end gap-4 items-center px-3 py-2">
        <p
          className="flex gap-2 cursor-pointer"
          onClick={() => {
            likePost();
          }}
        >
          {like ? (
            <BiSolidHeart size={24} className="text-fuchsia-500" />
          ) : (
            <BiHeart size={24} />
          )}
          {post?.likes?.length}
        </p>
        <p
          className="flex gap-2 cursor-pointer"
          onClick={() => {
            setShowComments(showComments === post._id ? null : post._id);
            getComments(post?.id);
          }}
        >
          <BiComment size={24} />
          {post?.comments?.length}
        </p>
        {user?._id === post?.userId?._id && (
          <div
            className="flex gap-1 items-center text-base "
            onClick={() => deletePost(post?._id)}
          >
            <MdOutlineDelete size={24} />
          </div>
        )}
      </div>
      {showComments === post?._id && (
        <div className="w-full border-indigo-900 border-b pb-4">
          <CommentForm
            user={user}
            id={post?._id}
            getComments={() => getComments(post?._id)}
          />
          {loading ? (
            '....loading'
          ) : comments?.length > 0 ? (
            comments?.map((comment) => (
              <div className="w-full py-2" key={comment?._id}>
                <div className="flex gap-3 items-center mb-1">
                  <Link to={`/profile/${comment?.userId?._id}`}>
                    <img
                      src={comment?.userId?.image ?? NoProfile}
                      alt={comment?.user?.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={`/profile/${comment?.userId?._id}`}>
                      <p className="font-medium text-sm">
                        {comment?.userId.name}
                      </p>
                    </Link>
                    <span className="text-xs opacity-50">
                      {moment(post?.createdAt ?? '2023-05-25').fromNow()}
                    </span>
                  </div>
                </div>
                <div className="ml-12 flex items-center justify-between">
                  <p className="text-sm">{comment?.comment}</p>
                  <div className="flex items-center space-x-2">
                    <p>
                      {comment?.likes?.includes(user?._id) ? (
                        <BiSolidHeart size={20} className="text-fuchsia-400" />
                      ) : (
                        <BiHeart size={20} />
                      )}
                    </p>
                    <p className="text-sm">{comment?.likes?.length}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span className="flex text-xs px-14 text-center opacity-50">
              ....Be the first to comment
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
