import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../redux/userSlice';
import { useParams } from 'react-router-dom';
import {
  FeedContainer,
  ProfileCard,
  TopBar,
  EditProfile,
  UserList,
} from '../components';
import { apiRequest } from '../utils';

const Profile = ({ searchData, showSearch, setSearchData, setShowSearch }) => {
  const { user, edit } = useSelector((state) => state.user);
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseProfile = await apiRequest({
          url: `/users/get-user/${id}`,
          method: 'get',
          token: user.token,
        });

        if (responseProfile.status === 'failed') {
          console.log(responseProfile.message);
        } else {
          // console.log('profile page useeffect ', responseProfile.data);
          setUserInfo(responseProfile.data.user);
          if (user._id === responseProfile.data.user._id) {
            const userData = {
              token: user?.token,
              ...responseProfile?.data?.user,
            };
            dispatch(userLogin(userData));
          } else {
            const responseUser = await apiRequest({
              url: `/users/get-user/${user._id}`,
              method: 'get',
              token: user.token,
            });
            if (responseUser.status === 'failed') {
              console.log(responseUser.message);
            } else {
              console.log(
                'profile page useeffect for our user',
                responseUser.data
              );
              const userData = {
                token: user?.token,
                ...responseUser?.data?.user,
              };
              dispatch(userLogin(userData));
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div
        className="bg-slate-950 w-full min-h-screen text-slate-300 px-0 lg:px-10 2xl:px-40"
        onClick={() => {
          setShowSearch(false);
        }}
      >
        <TopBar setSearchData={setSearchData} setShowSearch={setShowSearch} />
        <div className="w-full flex gap-2 lg:gap-4 pb-10 h-full">
          {/* left */}
          <div className="hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={userInfo} />
          </div>

          {/* center */}
          {showSearch ? (
            <UserList data={searchData} title="users" />
          ) : (
            <div className="flex-1 h-full bg-black flex flex-col overflow-y-auto rounded-xl">
              <div className="visible md:hidden">
                <ProfileCard userInfoId={userInfo._id} />
              </div>
              <FeedContainer />
            </div>
          )}

          {/* right */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto ">
            <UserList title="friends" data={userInfo.friends} />
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Profile;
