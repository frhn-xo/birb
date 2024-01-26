import React from 'react';
import { TextInput } from '../components';

const Login = () => {
  return (
    <div className="bg-slate-950 w-full h-screen flex flex-col items-center justify-center ">
      <div className="text-lg font-bold mb-4 text-indigo-300">🐤birb</div>
      <div className="bg text-slate-300 w-10/12 h-3/6 sm:w-5/12 sm:h-4/6 flex flex-col rounded-xl overflow-hidden  ring-2 ring-indigo-900 p-5 gap-3">
        <div className=" text-2xl font-bold">Login</div>
        <form className=" bg-black flex flex-col">
          <TextInput />
        </form>
      </div>
    </div>
  );
};

export default Login;
