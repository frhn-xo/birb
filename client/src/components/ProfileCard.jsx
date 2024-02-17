import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LiaEditSolid } from 'react-icons/lia';
import { IoSparklesSharp } from 'react-icons/io5';
import { LuTimer } from 'react-icons/lu';
import { IoPersonAdd } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';
import { FiCheck } from 'react-icons/fi';
import moment from 'moment';
import UserList from './UserList';

import { NoProfile } from '../assets';
import { updateProfile } from '../redux/userSlice';

const ProfileCard = ({ user: profile }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showUserList, setShowUserList] = useState(false);
  const [userListData, setuserListData] = useState(user.friends);
  const [userListTitle, setUserListTitle] = useState('friends');

  // console.log(profile.name, 'profile', profile);
  // console.log(user.name, 'user', user);

  const handleFriends = () => {
    setShowUserList(true);
    setuserListData(profile?.friends);
    setUserListTitle('friends');
  };

  const handleRequests = () => {
    setShowUserList(true);
    setuserListData(user?.inRequest);
    setUserListTitle('requests to you');
  };

  const handleSent = () => {
    setShowUserList(true);
    setuserListData(user?.outRequest);
    setUserListTitle('requests from sent');
  };

  return (
    <div>
      <div className="w-full bg-black flex flex-col items-center shadow-sm rounded-md px-7 pt-5 sm:px-6 sm:py-3 text-slate-300 ">
        <div className="w-full flex items-center justify-between border-b border-indigo-900 pb-5 ">
          <Link to={'/profile/' + profile?._id} className="flex gap-2">
            <img
              src={
                profile?._id === user?._id
                  ? user?.image ?? NoProfile
                  : profile?.image ?? NoProfile
              }
              alt={profile?.email}
              className="w-14 h-14 object-cover rounded-full mr-1"
            />

            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium ">
                {profile?._id === user?._id ? user?.name : profile?.name}
              </p>
            </div>
          </Link>

          <div className="">
            {profile?._id === user?._id ? (
              <div className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-lg p-1 px-2 mr-3">
                <LiaEditSolid
                  size={26}
                  onClick={() => dispatch(updateProfile(true))}
                />
              </div>
            ) : profile?.friends?.some((friend) => friend._id === user?._id) ? (
              <div className=" text-indigo-300 cursor-pointer rounded-lg p-1 px-2 mr-3">
                <IoSparklesSharp size={26} onClick={() => {}} />
              </div>
            ) : profile?.inRequest?.some(
                (request) => request._id === user?._id
              ) ? (
              <div className=" text-indigo-300 cursor-pointer rounded-lg p-1 px-2 mr-3 flex gap-1">
                <span className="md:hidden text-xs font-semibold pt-1.5">
                  sent
                </span>
                <LuTimer size={26} />
              </div>
            ) : profile?.outRequest?.some(
                (request) => request._id === user?._id
              ) ? (
              <div className="flex  mr-3">
                <div className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-lg p-1 px-2">
                  <FiCheck size={26} />
                </div>
                <div className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-lg p-1 px-2">
                  <MdOutlineCancel size={26} onClick={() => {}} />
                </div>
              </div>
            ) : (
              <div className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-lg p-1 px-2 mr-3">
                <IoPersonAdd size={26} onClick={() => {}} />
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-b border-indigo-900">
          <div className="flex gap-2 items-center ">
            <span>
              {profile?._id === user?._id
                ? user?.bio
                : profile?.bio ?? (
                    <span className="opacity-50">{'no bio :('}</span>
                  )}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4">
          <div className="flex justify-between">
            <button
              onClick={() => {
                setShowUserList(false);
                if (profile?.friends?.length !== 0) {
                  handleFriends();
                }
                console.log(profile.friends, 'profile friends', profile);
              }}
              className="hover:bg-indigo-700 p-1 rounded-md"
            >
              <p className="text-md font-medium text-center text-indigo-300 hover:text-slate-300">
                {profile?.friends?.length} friends
              </p>
            </button>

            {profile?._id === user?._id && (
              <>
                <button
                  onClick={() => {
                    setShowUserList(false);
                    if (profile?.inRequest?.length !== 0) {
                      handleRequests();
                    }
                  }}
                  className="hover:bg-indigo-700 p-1 rounded-md "
                >
                  <p className="text-md font-medium text-center text-indigo-300 hover:text-slate-300">
                    {profile?.inRequest?.length} requests
                  </p>
                </button>

                <button
                  onClick={() => {
                    setShowUserList(false);
                    if (profile?.outRequest?.length !== 0) {
                      handleSent();
                    }
                  }}
                  className="hover:bg-indigo-700 p-1 rounded-md "
                >
                  <p className="text-md font-medium text-center text-indigo-300 hover:text-slate-300">
                    {profile?.outRequest?.length} sent
                  </p>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="">Who viewed your profile</span>
            <span className=" text-lg">{profile?.views?.length}</span>
          </div>
          <span className="text-base text-blue">
            {profile?.verified ? 'Verified Account' : 'Not Verified'}
          </span>
          <div className="flex items-center text-sm opacity-50 text-right  justify-between">
            <span>{'Joined'}</span>
            <span className="text-xs">
              {moment(profile?.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
      {showUserList && (
        <UserList
          title={userListTitle}
          data={userListData}
          setClose={setShowUserList}
        />
      )}
    </div>
  );
};

export default ProfileCard;
