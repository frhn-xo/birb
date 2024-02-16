import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LiaEditSolid } from 'react-icons/lia';
import { BsPersonFillAdd } from 'react-icons/bs';
import moment from 'moment';

import { NoProfile } from '../assets';
import { updateProfile } from '../redux/userSlice';

const ProfileCard = ({ user }) => {
  const { user: data } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
    <div>
      <div className="w-full bg-black flex flex-col items-center shadow-sm rounded-md px-7 pt-5 sm:px-6 sm:py-3 text-slate-300  ">
        <div className="w-full flex items-center justify-between border-b border-indigo-900 pb-5 ">
          <Link to={'/profile/' + user?._id} className="flex gap-2">
            <img
              src={
                user?._id === data?._id ? data?.image : user?.image ?? NoProfile
              }
              alt={user?.email}
              className="w-10 h-10 object-cover rounded-full"
            />

            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium ">
                {user?._id === data?._id ? data?.name : user?.name}
              </p>
            </div>
          </Link>

          <div className="">
            {user?._id === data?._id ? (
              <LiaEditSolid
                size={30}
                className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer h-8 w-8 p-1 rounded-lg"
                onClick={() => dispatch(updateProfile(true))}
              />
            ) : (
              <BsPersonFillAdd
                size={20}
                className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer h-8 w-8 p-1 rounded-lg"
                onClick={() => {}}
              />
            )}
          </div>
        </div>

        <div
          className="w-full flex flex-col gap-2 py-4 border-b border-indigo-900"
          onClick={() => dispatch(updateProfile(true))}
        >
          <div className="flex gap-2 items-center ">
            <span>
              {user?._id === data?._id
                ? data?.bio
                : user?.bio ?? (
                    <span className="opacity-50">{'no bio :('}</span>
                  )}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4">
          <p className="text-md font-medium text-center">
            {user?.friends?.length} Friends
          </p>

          <div className="flex items-center justify-between">
            <span className="">Who viewed your profile</span>
            <span className=" text-lg">{user?.views?.length}</span>
          </div>

          <span className="text-base text-blue">
            {user?.verified ? 'Verified Account' : 'Not Verified'}
          </span>

          <div className="flex items-center text-sm opacity-50 text-right  justify-between">
            <span>{'Joined'}</span>
            <span className="text-xs">
              {' '}
              {moment(user?.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
