import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FriendsCard, PostCard, ProfileCard, TopBar } from '../components';
import { posts } from '../assets/data';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {};
  const handleLikePost = () => {};

  return (
    <>
      <div className="bg-slate-950 w-full min-h-screen text-slate-300 px-0 lg:px-10 2xl:px-40">
        <TopBar />
        <div className="w-full flex gap-2 lg:gap-4 pb-10 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={user} />
          </div>

          {/* CENTER */}
          <div className="flex-1 h-full bg-black flex flex-col gap-6 overflow-y-auto rounded-xl">
            <div className="visible md:hidden">
              <ProfileCard user={userInfo} />
            </div>
            {loading ? (
              <p className="text-amber-500 text-sm px-5">
                {'....hold on, loading em posts'}
              </p>
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-amber-500 text-sm px-5">
                  {'....No posts available'}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto ">
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
