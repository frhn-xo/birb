import React, { useState } from 'react';
import { CustomButton, TextInput } from '../components';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../utils';
import { useDispatch } from 'react-redux';
import { userRegister } from '../redux/userSlice';

const ResetPassword = () => {
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    dispatch(userRegister({ email: data.email }));
    try {
      const res = await apiRequest({
        url: '/auth/reset-password',
        data,
        method: 'POST',
      });
      console.log(res);
      if (res?.status === 'failed') {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        setTimeout(() => {
          navigateTo('/new-password');
        }, 800);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 w-full min-h-screen flex flex-col items-center justify-center py-14">
      <div className="text-lg font-bold mb-4 text-indigo-300">birb</div>
      <div className="text-slate-300 w-10/12 sm:w-4/12 sm:h-4/6 flex flex-col rounded-xl overflow-hidden bg-black p-5 gap-3 pb-10">
        <div className="text-indigo-300 text-2xl mb-3 font-bold">
          Reset your password.
        </div>
        <form
          className="flex flex-col gap-3 mt-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInput
            name="email"
            label="Registered Email Address"
            type="email"
            register={register('email', {
              required: 'Email Address is required',
            })}
            error={errors.email && errors.email.message}
          />
          {errMsg?.message && (
            <span
              className={`text-sm ${
                errMsg?.status == 'failed'
                  ? 'text-red-500 text-xs mt-1'
                  : 'text-green-500 text-xs mt-1'
              }mt-0.5`}
            >
              {errMsg?.message}
            </span>
          )}

          {isSubmitting ? (
            '....loading'
          ) : (
            <CustomButton
              containerStyles="justify-center text-slate-300 bg-indigo-700 rounded-lg font-semibold px-3 py-2 pt-1.5 my-3 w-full"
              title="Submit"
            />
          )}
        </form>
        <div className="text-indigo-300 text-sm flex flex-col justify-center">
          <p>
            You were just kidding, you remember your password ?{' '}
            <Link to="/login" className="underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
