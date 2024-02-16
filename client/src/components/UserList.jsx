import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdClose } from 'react-icons/md';

const UserList = ({ data }) => {
  const handleClose = () => {};
  console.log(data);
  return (
    <>
      <div className="bg-black h-min w-full">
        {data.length > 0 ? (
          data.map((user) => (
            <div key={user._id}>
              <div
                className="bg-black px-5
    pb-5 pt-3"
              >
                <div className="flex gap-3 items-center mb-2">
                  <Link to={`/profile/${user?._id}`}>
                    <img
                      src={user?.image ?? NoProfile}
                      alt=""
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </Link>
                  <div className="w-full flex justify-between">
                    <div className="">
                      <Link to={`/profile/${user?._id}`}>
                        <p className="font-medium text-md">{user?.name}</p>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mx-3">{user?.bio}</div>
                {/* <div className="mt-4 flex justify-end gap-4 items-center px-3 py-2">
            <p className="flex gap-2 cursor-pointer">
              {post?.likes?.includes(user?._id) ? (
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
            {user?._id === user?._id && (
              <div
                className="flex gap-1 items-center text-base "
                onClick={() => deletePost(post?._id)}
              >
                <MdOutlineDelete size={24} />
              </div>
            )}
          </div> */}
              </div>
            </div>
          ))
        ) : (
          <p className="text-amber-500 text-sm px-5">
            {'....No users available'}
          </p>
        )}
      </div>
    </>
  );
};

export default UserList;
