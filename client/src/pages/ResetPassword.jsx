import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { CustomButton, TextInput } from '../components';

const ResetPassword = () => {
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' });

  const onSubmit = async (data) => {};

  return (
    <div className="bg-slate-950 w-full min-h-screen flex flex-col items-center justify-center py-14">
      <div className="text-lg font-bold mb-4 text-indigo-300">birb</div>
      <div className="text-slate-300 w-10/12 sm:w-4/12 sm:h-4/6 flex flex-col rounded-xl overflow-hidden  ring-2 ring-indigo-900 p-5 gap-3 pb-10">
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
            'loading'
          ) : (
            <CustomButton
              containerStyles="justify-center text-slate-300 bg-indigo-700 rounded-lg font-semibold px-3 py-2 pt-1.5 my-3 w-full"
              title="submit"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
