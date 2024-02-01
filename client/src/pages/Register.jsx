import React, { useState } from 'react';
import { CustomButton, TextInput } from '../components';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' });

  const onSubmit = async (data) => {};

  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className="bg-slate-950 w-full min-h-screen py-14 flex flex-col items-center justify-center ">
      <div className="text-lg font-bold mb-4 text-indigo-300">birb</div>
      <div className="text-slate-300 w-10/12 sm:w-4/12 sm:h-4/6 flex flex-col rounded-xl overflow-hidden bg-black p-5 gap-3 pb-10">
        <div className="text-indigo-300 text-2xl mb-3 font-bold">
          Create an account.
        </div>
        <form
          className="flex flex-col gap-3 mt-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInput
            name="name"
            label="Name"
            register={register('name', {
              required: 'Name is required',
            })}
            error={errors.name ? errors.name.message : ''}
          />
          <TextInput
            name="email"
            label="Email Address"
            type="email"
            register={register('email', {
              required: 'Email Address is required',
            })}
            error={errors.email && errors.email.message}
          />
          <TextInput
            name="password"
            label="Password"
            type="password"
            register={register('password', {
              required: 'Password is required',
            })}
            error={errors.password && errors.password.message}
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
            '....'
          ) : (
            <CustomButton
              containerStyles="justify-center text-slate-300 bg-indigo-700 rounded-lg font-semibold px-3 py-2 pt-1.5 my-3 w-full"
              title="Register"
            />
          )}
        </form>
        <div className="text-indigo-300 text-sm flex flex-row justify-center">
          <p>Already have an account ?</p>
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
