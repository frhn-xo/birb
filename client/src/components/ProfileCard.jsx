import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LiaEditSolid } from 'react-icons/lia';
import { IoSparklesSharp } from 'react-icons/io5';
import { LuTimer } from 'react-icons/lu';
import { IoPersonAdd } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';
import { IoMdAddCircle } from 'react-icons/io';
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
              className="w-14 h-14 object-cover rounded-full mr-1"
            />

            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium ">
                {user?._id === data?._id ? data?.name : user?.name}
              </p>
            </div>
          </Link>

          <div className="">
            {user?._id === data?._id ? (
              <div className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-lg p-1 px-2 mr-3">
                <LiaEditSolid
                  size={26}
                  onClick={() => dispatch(updateProfile(true))}
                />
              </div>
            ) : user?.friends?.some((friend) => friend._id === data?._id) ? (
              <div className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-lg p-1 px-2 mr-3">
                <IoSparklesSharp size={26} onClick={() => {}} />
              </div>
            ) : user?.inRequest?.some(
                (request) => request._id === data?._id
              ) ? (
              <div className="flex  mr-3">
                <div className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-lg p-1 px-2">
                  <IoMdAddCircle size={26} onClick={() => {}} />
                </div>
                <div className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-lg p-1 px-2">
                  <MdOutlineCancel size={26} onClick={() => {}} />
                </div>
              </div>
            ) : user?.outRequest?.some(
                (request) => request._id === data?._id
              ) ? (
              <div className=" text-indigo-300 cursor-pointer rounded-lg p-1 px-2 mr-3 flex gap-1">
                <span className="md:hidden text-xs font-semibold pt-1.5">
                  request sent
                </span>
                <LuTimer size={26} />
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
