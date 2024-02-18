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
import { apiRequest } from '../utils';
import {
  updateOutList,
  updateProfile,
  updateFriend,
  updateInRequest,
} from '../redux/userSlice';

const ProfileCard = ({ user: profile }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showUserList, setShowUserList] = useState(false);
  const [userListData, setuserListData] = useState(user.friends);
  const [userListTitle, setUserListTitle] = useState('friends');

  const addFriend = async () => {
    try {
      const response = await apiRequest({
        url: `users/friend-request`,
        method: 'post',
        data: { requestTo: profile._id },
        token: user?.token,
      });
      console.log('Friend request status - ', response.status);
      if (response.status === 'success') {
        const outListProfile = {
          _id: profile._id,
          name: profile.name,
          image: profile?.image,
        };
        dispatch(updateOutList(outListProfile));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const acceptFriend = async () => {
    try {
      const response = await apiRequest({
        url: `users/accept-request`,
        method: 'post',
        data: { status: 'Accepted', requestBy: profile._id },
        token: user?.token,
      });
      console.log('Friend accept status - ', response.status);

      if (response.status === 'success') {
        const friendProfile = {
          _id: profile._id,
          name: profile.name,
          image: profile?.image,
        };
        dispatch(updateFriend(friendProfile));
      }
    } catch (error) {
      console.error(
        'Error accepting friend request:',
        error.response.data.message
      );
    }
  };

  const rejectFriend = async () => {
    try {
      const response = await apiRequest({
        url: `users/accept-request`,
        method: 'post',
        data: { status: 'Rejected', requestBy: profile._id },
        token: user?.token,
      });
      console.log('Friend accept status - ', response.status);

      if (response.status === 'success') {
        // const friendProfile = {
        //   _id: profile._id,
        //   name: profile.name,
        //   image: profile?.image,
        // };
        dispatch(updateInRequest(profile._id));
      }
    } catch (error) {
      console.error(
        'Error accepting friend request:',
        error.response.data.message
      );
    }
  };

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
    setUserListTitle('requests you sent');
  };

  return (
    <div>
      <div className="flex flex-col items-center shadow-sm rounded-md px-4 py-2 pb-3 sm:px-6 sm:py-3 text-slate-300 mt-5 m-3 sm:m-0 bg-black ">
        <div className="w-full flex items-center justify-between border-b border-indigo-900 pb-5">
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
            ) : user?.friends?.some((friend) => friend._id === profile?._id) ? (
              <div className=" text-indigo-300 cursor-pointer rounded-lg p-1 px-2 mr-3">
                <IoSparklesSharp size={26} />
              </div>
            ) : user?.outRequest?.some(
                (request) => request._id === profile?._id
              ) ? (
              <div className=" text-indigo-300 cursor-pointer rounded-lg p-1 px-2 mr-3 flex gap-1">
                <span className="md:hidden text-xs font-semibold pt-1.5">
                  sent
                </span>
                <LuTimer size={26} />
              </div>
            ) : user?.inRequest?.some(
                (request) => request._id === profile?._id
              ) ? (
              <div className="flex mr-3">
                <div className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-lg p-1 px-2">
                  <FiCheck
                    size={26}
                    onClick={() => {
                      acceptFriend();
                    }}
                  />
                </div>
                <div className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-lg p-1 px-2">
                  <MdOutlineCancel
                    size={26}
                    onClick={() => {
                      rejectFriend();
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-lg p-1 px-2 mr-3">
                <IoPersonAdd
                  size={26}
                  onClick={() => {
                    addFriend();
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-b border-indigo-900">
          <div className="flex gap-2 items-center ">
            <span>
              {profile?._id === user?._id
                ? user?.bio ?? <span className="opacity-50">{'no bio :('}</span>
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
