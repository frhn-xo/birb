import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../assets/birb.png';
import { useForm } from 'react-hook-form';
import TextInput from './TextInput';
import CustomButton from './CustomButton';
import { updateProfile } from '../redux/userSlice';
import { apiRequest } from '../utils';
import { IoSearch } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';

const TopBar = ({ setSearchData }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
    formState: { errors: errorsSearch },
  } = useForm();

  const {
    register: registerMobileSearch,
    handleSubmit: handleSubmitMobileSearch,
    formState: { errors: errorsMobileSearch },
  } = useForm();

  const handleSearch = async (data) => {
    console.log(data, 'clicked');
    try {
      const response = await apiRequest({
        url: `/users/search?name=${data.searchString}`,
        method: 'get',
        token: user.token,
      });

      if (response.status !== 'failed') {
        console.log(response.data.data);
        setSearchData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-950 w-full flex items-center justify-between pt-2.5 pb-1 px-4 rounded-b-xl text-slate-300">
      <Link to="/">
        <img className="h-7" src={logo} alt="Logo" />
      </Link>

      <div className="md:w-3/6 lg:w-2/6 flex">
        {/* First form */}
        <form
          className="hidden md:flex items-center justify-center w-full gap-1"
          onSubmit={handleSubmitSearch(handleSearch)}
        >
          <TextInput
            register={registerSearch('searchString', {
              required: 'empty search',
            })}
            styles="w-full ring-indigo-950"
          />
          <CustomButton
            title="Search"
            containerStyles="justify-center bg-black text-indigo-300 rounded-xl font-semibold mt-2 px-3 py-2 mx-1 hover:bg-indigo-700 hover:text-slate-300"
          />
        </form>

        <CustomButton
          onClick={() => dispatch(Logout())}
          title="Logout"
          containerStyles="hidden md:block justify-center bg-black text-indigo-300 sm:rounded-xl rounded-md hover:bg-indigo-700 font-semibold ml-auto sm:mt-2 sm:p-3 sm:py-2 p-1 my-2 mt-3 sm:m-0
          hover:text-slate-300"
        />

        {/* Second form */}
        <form
          className="md:hidden items-center justify-center w-auto ml-5 gap-2 flex"
          onSubmit={handleSubmitMobileSearch(handleSearch)}
        >
          <TextInput
            register={registerMobileSearch('searchString', {
              required: 'Password is required',
            })}
            styles="w-full ring-indigo-950 h-8"
          />
          <button
            type="submit"
            className="bg-black text-indigo-300 hover:bg-indigo-700 mt-2 p-2 rounded-md w-10 h-9 flex items-center justify-center"
          >
            <IoSearch size={20} />
          </button>
        </form>

        <button
          onClick={() => dispatch(Logout())}
          className="md:hidden bg-black text-indigo-300 hover:bg-indigo-700 mt-2 rounded-md flex items-center justify-center w-10 h-9 pl-0"
        >
          <MdLogout size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
