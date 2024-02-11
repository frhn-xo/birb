import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from './TextInput';
import CustomButton from './CustomButton';
import { updateProfile } from '../redux/userSlice';

const EditProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picture, setPicture] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: { ...user },
  });

  const onSubmit = async (data) => {};

  const handleClose = () => {
    dispatch(updateProfile(false));
  };
  const handleSelect = (e) => {
    setPicture(e.target.files[0]);
  };

  return (
    <>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 bg-black bg-opacity-70">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 opacity-70"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen bg-red-300"></span>
          &#8203;
          <div
            className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full bg-black text-slate-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="text-indigo-300 text-2xl mb-3 font-bold"
              >
                Edit Profile
              </label>

              <button className="text-ascent-1" onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>
            <form
              className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                name="name"
                label="Username"
                placeholder="Username"
                type="text"
                styles="w-full"
                register={register('name', {
                  required: 'Username is required!',
                })}
                error={errors.name ? errors.name?.message : ''}
              />

              <TextInput
                label="bio"
                placeholder="bio"
                type="text"
                styles="w-full"
                register={register('bio', {
                  required: 'bio do no match',
                })}
                error={errors.bio ? errors.bio?.message : ''}
              />

              <label
                className="flex-row items-center text-ascent-2 hover:cursor-pointer my-4"
                htmlFor="imgUpload"
              >
                <p className="font-semibold mb-2">Profile Pic </p>
                <input
                  type="file"
                  id="imgUpload"
                  onChange={(e) => handleSelect(e)}
                  accept=".jpg, .png, .jpeg"
                />
              </label>

              {errMsg?.message && (
                <span
                  role="alert"
                  className={`text-sm ${
                    errMsg?.status == 'failed'
                      ? 'text-red-500 text-xs mt-1'
                      : 'text-green-500 text-xs mt-1'
                  }mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className="py-5 sm:flex sm:flex-row-reverse border-t">
                {isSubmitting ? (
                  '....loading'
                ) : (
                  <CustomButton
                    type="submit"
                    containerStyles="justify-center text-slate-300 bg-indigo-700 rounded-lg font-semibold px-3 py-2 pt-1.5 my-3 w-full"
                    title="Submit"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
