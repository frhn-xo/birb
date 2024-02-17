import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from './TextInput';
import CustomButton from './CustomButton';
import { updateProfile, userLogin } from '../redux/userSlice';
import { apiRequest } from '../utils';

const EditProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState('');
  const [posting, setPosting] = useState(false);
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: { ...user },
  });

  const handleEditSubmit = async (data) => {
    try {
      console.log(data.name, data.bio);
      setPosting(true);

      const formData = new FormData();
      formData.append('name', data.name);

      if (data.bio.trim()) {
        formData.append('bio', data.bio);
      }

      if (file) {
        if (file.size <= 5 * 1024 * 1024) {
          formData.append('image', file);
        } else {
          throw new Error(`File size shouldn't be more than 5MB, brrrr...`);
        }
      }

      console.log(formData, ' - formdata');

      const res = await apiRequest({
        url: '/users/update-user',
        method: 'put',
        data: formData,
        token: user.token,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 'failed') {
        setErrMsg(res.message || 'Unknown error occurred');
      } else {
        setErrMsg(res);
        const userData = {
          token: res?.data?.token,
          ...res?.data?.user,
        };
        console.log('userData ', userData);
        dispatch(userLogin(userData));
      }
    } catch (error) {
      setErrMsg(error.message);
      console.error(error);
    } finally {
      setPosting(false);
      setFile(null);
    }
  };

  const handleClose = () => {
    dispatch(updateProfile(false));
  };

  return (
    <>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 bg-black bg-opacity-70">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 opacity-70"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen bg-red-300"></span>
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

              <button
                className="text-ascent-1 text-indigo-300 hover:text-slate-300 mb-2"
                onClick={handleClose}
              >
                <MdClose size={25} />
              </button>
            </div>
            <form
              className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
              onSubmit={handleSubmit(handleEditSubmit)}
            >
              <TextInput
                name="name"
                label="Name"
                placeholder="name"
                type="text"
                styles="w-full"
                register={register('name', {
                  required: 'Name is required!',
                  pattern: {
                    value: /^[a-zA-Z0-9_.]+$/,
                    message:
                      'Name should only contain alphanumeric, underscores and dots.',
                  },
                })}
                error={errors.name ? errors.name?.message : ''}
              />

              <TextInput
                label="bio"
                placeholder="bio"
                type="text"
                styles="w-full"
                register={register('bio', {
                  maxLength: {
                    value: 150,
                    message: 'bio cannot exceed 150 characters',
                  },
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
                  onChange={(e) => setFile(e.target.files[0])}
                  id="imgUpload"
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
                {posting ? (
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
