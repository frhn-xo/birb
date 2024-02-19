import React, { useState } from 'react';
import { CustomButton, TextInput } from '../components';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils';
import { useSelector } from 'react-redux';

const NewPassword = () => {
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' });

  const onSubmit = async (data) => {
    console.log({ ...data, email: user?.user?.email });
    setIsSubmitting(true);
    try {
      const res = await apiRequest({
        url: '/auth/verify',
        data: { ...data, email: user?.user?.email },
        method: 'POST',
      });
      console.log(res);
      if (res?.status === 'failed') {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        setTimeout(() => {
          window.location.replace('/login');
        }, 800);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {user?.user?.email ? (
        <div className="bg-slate-950 w-full min-h-screen py-14 flex flex-col items-center justify-center ">
          <div className="text-lg font-bold mb-4 text-indigo-300">birb</div>
          <div className="text-slate-300 w-10/12 sm:w-4/12 sm:h-4/6 flex flex-col rounded-xl overflow-hidden bg-black p-5 gap-3 pb-10">
            <div className="text-indigo-300 text-2xl mb-3 font-bold">
              Verify Email.
            </div>
            <form
              className="flex flex-col gap-3 mt-1"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                name="otp"
                label="OTP (check your email)"
                register={register('otp', {
                  required: 'OTP is required',
                })}
                error={errors.otp && errors.otp.message}
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
                  title="Verify"
                />
              )}
            </form>
          </div>
        </div>
      ) : (
        <Navigate to="/register" replace />
      )}
    </>
  );
};

export default NewPassword;
