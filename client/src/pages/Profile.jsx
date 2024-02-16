import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  FeedContainer,
  FriendsCard,
  ProfileCard,
  TopBar,
  EditProfile,
} from '../components';
import { apiRequest } from '../utils';

const Profile = () => {
  const { user, edit } = useSelector((state) => state.user);
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiRequest({
          url: `/users/get-user/${id}`,
          method: 'get',
          token: user.token,
        });

        if (response.status === 'failed') {
          console.log(response.message);
        } else {
          setUserInfo(response.data.user);
          // console.log('profilejsx ka ', response, response.data.name);
          // console.log(userInfo);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [id]);

  return (
    <>
      <div className="bg-slate-950 w-full min-h-screen text-slate-300 px-0 lg:px-10 2xl:px-40">
        <TopBar />
        <div className="w-full flex gap-2 lg:gap-4 pb-10 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={userInfo} />
          </div>

          {/* CENTER */}
          <div className="flex-1 h-full bg-black flex flex-col gap-6 overflow-y-auto rounded-xl">
            <div className="visible md:hidden">
              <ProfileCard user={userInfo} />
            </div>
            <FeedContainer userInfoId={userInfo._id} />
          </div>

          {/* RIGHT */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto ">
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Profile;
