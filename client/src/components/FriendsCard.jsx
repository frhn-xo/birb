import React from 'react';
import { Link } from 'react-router-dom';
import { NoProfile } from '../assets';

const FriendsCard = ({ friends }) => {
  return (
    <div>
      <div className="w-full bg-black shadow-sm rounded-2xl px-5 py-5 text-slate-300 ">
        <div className="flex items-center justify-between text-sm font-semibold pb-2 border-b border-indigo-900">
          <span> Friends</span>
          <span>{friends?.length}</span>
        </div>

        <div className="w-full flex flex-col gap-4 pt-4">
          {friends?.map((friend) => (
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
              <div className="flex-1">
                <p className="text-base font-medium">{friend?.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsCard;
