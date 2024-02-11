import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TopBar,
  ProfileCard,
  FriendsCard,
  CustomButton,
  TextInput,
  PostCard,
  EditProfile,
} from '../components';
import { suggest, requests, posts } from '../assets/data';
import { NoProfile } from '../assets';
import { Link } from 'react-router-dom';
import { BsPersonFillAdd } from 'react-icons/bs';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import { useForm } from 'react-hook-form';

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const [friendRequest, setFriendRequest] = useState(requests);
  const [suggestedFriends, setSuggestedFriends] = useState(suggest);
  const [errMsg, setErrMsg] = useState('');
  const [file, setFile] = useState(null);
  const [posting, setposting] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handlePostSubmit = async (data) => {};
  return (
    <>
      <div className="bg-slate-950 w-full min-h-screen text-slate-300 px-0 lg:px-10 2xl:px-40">
        <TopBar />
        <div className="w-full flex gap-2 lg:gap-4 pb-10 h-full">
          {/* left */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto ">
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* center */}
          <div className="flex-1 h-full bg-black flex flex-col gap-6 overflow-y-auto rounded-xl">
            <form
              className="bg-black px-4 rounded-xl"
              onSubmit={handleSubmit(handlePostSubmit)}
            >
              <div className="w-full flex items-center gap-2 py-4">
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt="User Image"
                  className="w-10 h-10 object-cover rounded-full"
                />
                <TextInput
                  styles="w-full rounded-full ring-indigo-950"
                  placeholder="....what's poppin' ?"
                  name="description"
                  register={register('description', {
                    required: 'Write something about the post brrrrr',
                  })}
                  error={errors.description ? errors.description.message : ''}
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
              <div className="flex items-center gap-3 text-xs  justify-end">
                <label
                  htmlFor="imgUpload"
                  className="flex items-center gap-1 text-sm cursor-pointer text-indigo-300 px-3"
                >
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                    id="imgUpload"
                    data-max-size="5120"
                    accept=".jpg, .png, .jpeg"
                  />
                  <BiImages size={22} />
                  <span className="hidden sm:inline-block">Image</span>
                </label>

                <label
                  htmlFor="videoUpload"
                  className="flex items-center gap-1 text-sm cursor-pointer text-indigo-300 px-3"
                >
                  <input
                    type="file"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="hidden"
                    id="videoUpload"
                    accept=".mp4, .wav"
                  />
                  <BiSolidVideo size={22} />
                  <span className="hidden sm:inline-block">Video</span>
                </label>

                {posting ? (
                  '....loading'
                ) : (
                  <CustomButton
                    title="Post"
                    containerStyles="
                      justify-center bg-indigo-950 hover:text-slate-300 rounded-lg hover:bg-indigo-700 py-1.5 px-5 text-sm"
                  />
                )}
              </div>
            </form>
            {loading ? (
              <p className="text-amber-500 text-sm px-5">
                {'....hold on, loading yo posts'}
              </p>
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={() => {}}
                  likePost={() => {}}
                />
              ))
            ) : (
              <p className="text-amber-500 text-sm px-5">
                {'....No posts available'}
              </p>
            )}
          </div>

          {/* right */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto ">
            <div className="w-full bg-black shadow-sm rounded-xl px-6 py-5">
              <div className="flex items-center justify-between text-sm font-semibold  pb-2 border-b border-indigo-900 ">
                <span> Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>

              <div className="w-full flex flex-col gap-4 pt-4">
                {friendRequest?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className="flex items-center justify-between">
                    <Link
                      to={'/profile/' + from._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={from?.profileUrl ?? NoProfile}
                        alt={from?.name}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-base font-medium">{from?.name}</p>
                      </div>
                    </Link>

                    <div className="flex gap-1">
                      <CustomButton
                        title="Accept"
                        containerStyles="text-sm px-1.5 py-2
                      justify-center text-indigo-300 hover:text-slate-300 rounded-xl hover:bg-indigo-700"
                      />
                      <CustomButton
                        title="Deny"
                        containerStyles="text-sm px-1.5
                      justify-center text-indigo-300 hover:text-slate-300 rounded-xl hover:bg-indigo-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className="w-full bg-black shadow-sm rounded-xl px-5 py-5">
              <div className="flex items-center justify-between text-sm font-semibold pb-2 border-b border-indigo-900">
                <span>Friend Suggestion</span>
              </div>

              <div className="w-full flex flex-col gap-4 pt-4">
                {suggestedFriends?.map((friend) => (
                  <div
                    className="flex items-center justify-between"
                    key={friend._id}
                  >
                    <Link
                      to={'/profile/' + friend?._id}
                      key={friend?._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.name}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1 ">
                        <p className="text-base font-medium">{friend?.name}</p>
                      </div>
                    </Link>

                    <div className="flex gap-1">
                      <button
                        className=" text-sm p-1 rounded-xl"
                        onClick={() => {}}
                      >
                        <BsPersonFillAdd
                          size={30}
                          className="text-indigo-300 hover:text-slate-300 hover:bg-indigo-700 px-1 rounded-xl"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {edit && <EditProfile />}
    </>
  );
};

export default Home;
