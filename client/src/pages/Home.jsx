import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPost } from '../redux/postSlice';
import { userLogin } from '../redux/userSlice';
import {
  TopBar,
  ProfileCard,
  CustomButton,
  TextInput,
  EditProfile,
  FeedContainer,
  UserList,
} from '../components';
import { NoProfile } from '../assets';
import { apiRequest } from '../utils';
import { BiImages } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Home = ({ searchData, showSearch, setSearchData, setShowSearch }) => {
  const { user, edit } = useSelector((state) => state.user);
  const [errMsg, setErrMsg] = useState('');
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiRequest({
          url: `/users/get-user`,
          method: 'get',
          token: user.token,
        });

        if (response.status === 'failed') {
          console.log(response.message);
        } else {
          const userData = { token: user?.token, ...response?.data?.user };
          dispatch(userLogin(userData));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {
    try {
      setPosting(true);
      const formData = new FormData();
      formData.append('description', data.description);

      if (file) {
        if (file.size <= 5 * 1024 * 1024) {
          formData.append('image', file);
        } else {
          throw new Error(`File size shouldn't be more than 5MB, brrrr...`);
        }
      }

      // console.log(formData, ' - formdata', data.description);

      const response = await apiRequest({
        url: '/posts/create-post',
        method: 'post',
        data: formData,
        token: user.token,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 'failed') {
        setErrMsg(response.message);
      } else {
        setErrMsg(response.message);
        await setTimeout(() => {
          setErrMsg('');
        }, 700);
        reset();
        console.log(response.data.data);
        response.data.data.userId = user;
        dispatch(addPost(response.data.data));
      }
    } catch (error) {
      setErrMsg(error.message);
      console.error(error);
    } finally {
      setPosting(false);
      setFile(null);
    }
  };

  return (
    <>
      <div
        className="bg-slate-950 w-full min-h-screen text-slate-300 px-0 lg:px-10 2xl:px-40"
        onClick={() => {
          setShowSearch(false);
        }}
      >
        <TopBar setSearchData={setSearchData} setShowSearch={setShowSearch} />
        <div className="w-full flex gap-2 lg:gap-4 pb-4 h-full">
          {/* left */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col md:gap-6 overflow-y-auto ">
            <ProfileCard user={user} />
            <UserList title="friends" data={user.friends} />
          </div>
          {/* center */}
          {showSearch ? (
            <div className="flex-1 h-full bg-black flex flex-col md:gap-6 overflow-y-auto rounded-xl">
              <UserList data={searchData} title="results" />
            </div>
          ) : (
            <div className="flex-1 h-full bg-black flex flex-col md:gap-6 overflow-y-auto rounded-xl">
              <form
                className="bg-black px-4 rounded-xl"
                onSubmit={handleSubmit(handlePostSubmit)}
              >
                <div className="w-full flex items-center gap-2 py-3">
                  <Link to={`/profile/${user?._id}`}>
                    <img
                      src={user?.image ?? NoProfile}
                      alt="User Image"
                      className="w-10 h-10 object-cover rounded-full m-1"
                    />
                  </Link>
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
                {errMsg && (
                  <span
                    role="alert"
                    className={`text-sm ${
                      errMsg.includes('failed')
                        ? 'text-red-500 text-xs mt-1'
                        : 'text-green-500 text-xs mt-1'
                    }mt-0.5`}
                  >
                    {errMsg}
                  </span>
                )}
                <div className="flex items-center gap-3 text-xs  justify-end">
                  <label
                    htmlFor="imgUpload"
                    className="flex items-center gap-1 text-sm cursor-pointer text-indigo-300 px-3"
                  >
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                      id="imgUpload"
                      accept=".jpg, .png, .jpeg"
                    />
                    <BiImages size={22} />
                    <span className="hidden sm:inline-block">Image</span>
                  </label>
                  {posting ? (
                    '....might take a while'
                  ) : (
                    <CustomButton
                      title="Post"
                      containerStyles="justify-center bg-indigo-950 hover:text-slate-300 rounded-lg hover:bg-indigo-700 py-1.5 px-5 text-sm"
                    />
                  )}
                </div>
              </form>
              <FeedContainer />
            </div>
          )}

          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto ">
            <UserList title="requests" data={user.inRequest} />
          </div>
        </div>
      </div>
      {edit && <EditProfile />}
    </>
  );
};

export default Home;
