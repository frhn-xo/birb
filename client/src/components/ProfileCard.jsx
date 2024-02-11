import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LiaEditSolid } from 'react-icons/lia';
import { BsBriefcase, BsPersonFillAdd } from 'react-icons/bs';
import { CiLocationOn } from 'react-icons/ci';
import moment from 'moment';

import { NoProfile } from '../assets';
import { updateProfile } from '../redux/userSlice';

const ProfileCard = ({ user }) => {
  const { user: data, edit } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(data, user);
  return (
    <div>
      <div className="w-full bg-black flex flex-col items-center shadow-sm rounded-xl px-6 py-4 text-slate-300 ">
        <div className="w-full flex items-center justify-between border-b border-indigo-900 pb-5 ">
          <Link to={'/profile/' + user?._id} className="flex gap-2">
            <img
              src={user?.profileUrl ?? NoProfile}
              alt={user?.email}
              className="w-10 h-10 object-cover rounded-full"
            />

            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium ">{user?.name}</p>
            </div>
          </Link>

          <div className="">
            {user?._id === data?._id ? (
              <LiaEditSolid
                size={30}
                className=" text-indigo-300 hover:bg-indigo-700 cursor-pointer rounded-xl px-1"
                onClick={() => dispatch(updateProfile(true))}
              />
            ) : (
              <button
                className="bg-[#0444a430] text-sm text-white p-1 rounded"
                onClick={() => {}}
              >
                <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
              </button>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 border-b border-indigo-900">
          <div className="flex gap-2 items-center ">
            <CiLocationOn className="text-xl " />
            <span>{user?.bio ?? 'Add Bio'}</span>
          </div>

          <div className="flex gap-2 items-center ">
            <BsBriefcase className=" text-lg " />
            <span>{user?.profession ?? 'Add Profession'}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 py-4 ">
          <p className="text-lg font-semibold">
            {user?.friends?.length} Friends
          </p>

          <div className="flex items-center justify-between">
            <span className="">Who viewed your profile</span>
            <span className=" text-lg">{user?.views?.length}</span>
          </div>

          <span className="text-base text-blue">
            {user?.verified ? 'Verified Account' : 'Not Verified'}
          </span>

          <div className="flex items-center justify-between">
            <span className="">Joined</span>
            <span className=" text-base">
              {moment(user?.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
