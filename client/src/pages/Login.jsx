import React, { useState } from 'react';
import { CustomButton, TextInput } from '../components';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from '../redux/userSlice';
import { apiRequest } from '../utils';

const Login = () => {
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest({
        url: '/auth/login',
        data,
        method: 'POST',
      });
      console.log(res);
      if (res?.status === 'failed') {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        const userData = { token: res?.data?.token, ...res?.data?.user };
        console.log('userData ', userData);
        dispatch(userLogin(userData));
        setInterval(() => {
          window.location.replace('/');
        }, 500);
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
      <div
        className="text-slate-300
      bg-black w-10/12 sm:w-4/12 sm:h-4/6 flex flex-col rounded-xl overflow-hidden p-5 gap-3 pb-10"
      >
        <div className="text-indigo-300 text-2xl mb-3 font-bold">
          Log in to your account.
        </div>
        <form
          className="flex flex-col gap-3 mt-1"
          onSubmit={handleSubmit(onSubmit)}
        >
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

          <Link
            to="/reset-password"
            className="text-indigo-300 text-sm text-right underline"
          >
            Forgot Password ?
          </Link>
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
              title="login"
            />
          )}
        </form>
        <div className="text-indigo-300 text-sm flex flex-row justify-center">
          <p>Don't have an account ?</p>
          <Link to="/register" className="underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
