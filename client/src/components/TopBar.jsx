import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../assets/birb.png';
import { useForm } from 'react-hook-form';
import TextInput from './TextInput';
import CustomButton from './CustomButton';
import { UpdateProfile } from '../redux/userSlice';

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSearch = async (data) => {};
  return (
    <div className="bg-gray-950 w-full flex items-center justify-between pt-2 pb-1 px-4 rounded-b-xl text-slate-300">
      <Link to="/">
        <img className="h-7" src={logo} />
      </Link>

      <div className="md:w-3/6 lg:w-2/6 flex">
        <form
          className="hidden md:flex items-center justify-center w-full gap-1 "
          onSubmit={handleSubmit(handleSearch)}
        >
          <TextInput
            register={register('search')}
            styles="w-full ring-indigo-950"
          />
          <CustomButton
            title="Search"
            containerStyles="justify-center bg-black text-indigo-300 rounded-xl font-semibold mt-2 px-3 py-2 mx-1 hover:bg-indigo-700 hover:text-slate-300"
          />
        </form>
        <CustomButton
          title="Edit"
          containerStyles="md:hidden justify-center bg-black text-indigo-300 rounded-xl hover:bg-indigo-700 font-semibold ml-auto mt-2 p-3 py-2
          hover:text-slate-300"
          onClick={() => dispatch(UpdateProfile(true))}
        />
        <CustomButton
          onClick={() => dispatch(Logout())}
          title="logout"
          containerStyles="justify-center bg-black text-indigo-300 rounded-xl hover:bg-indigo-700 font-semibold ml-auto mt-2 p-3 py-2
          hover:text-slate-300"
        />
      </div>
    </div>
  );
};

export default TopBar;
