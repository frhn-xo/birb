import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { NoProfile } from '../assets';

const UserList = ({ data, title, setClose = false }) => {
  const handleClose = () => {
    if (setClose !== false) setClose(false);
  };
  return (
    <>
      <div className="w-full bg-black shadow-sm rounded-2xl px-5 py-5 text-slate-300">
        <div className="flex items-center justify-between text-sm font-semibold pb-2 border-b border-indigo-900">
          <span>{title}</span>
          {setClose !== false && (
            <button
              className="text-ascent-1 text-indigo-300 hover:text-slate-300"
              onClick={handleClose}
            >
              <MdClose size={22} />
            </button>
          )}
        </div>
        <div className="w-full flex flex-col gap-4 py-4 border-b border-indigo-900">
          {data ? (
            data.map((user) => (
              <Link
                to={'/profile/' + user?._id}
                key={user?._id}
                className="w-full flex gap-4 items-center cursor-pointer text-indigo-300 hover:text-slate-300"
              >
                <img
                  src={user?.image ?? NoProfile}
                  alt={user?.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <div className="flex-1">
                  <p className="text-base font-medium">{user?.name}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-amber-500 text-sm px-5">
              {'....No posts available'}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserList;
