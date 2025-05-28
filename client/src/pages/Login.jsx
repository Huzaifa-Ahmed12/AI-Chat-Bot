import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleregisterr = () => {
    navigate('/register');
  }

  const handleSubmit = async () => {
    const res = await axios.post('/auth/login', form);
    localStorage.setItem('token', res.data.token);
    navigate('/');
  };

  return (
    <div className='bg-black text-gray-100 p-4 flex justify-center items-center h-[100vh] w-[100vw]' >
      <div className='w-[30%] flex flex-col justify-center items-center bg-gray-800 p-[2vw] rounded-lg shadow-lg' >
      <h1 className='text-3xl font-semibold mb-[0.5vw]' >Login</h1>
      <input className='w-[80%] my-[0.5vw] border-2 border-gray-500 p-3 rounded-2xl'  name="email" placeholder="Email" onChange={handleChange} /><br />
      <input className='w-[80%] my-[0.5vw] border-2 border-gray-500 p-3 rounded-2xl' type="password" name="password" placeholder="Password" onChange={handleChange} /><br />
      <button className='bg-gray-500 cursor-pointer  hover:bg-gray-100 text-gray-800 font-semibold py-1 px-6 border border-gray-400 rounded shadow'  onClick={handleSubmit}>Login</button>
      <div>
        <span>Don't have an account? </span>
        <span><button className='hover:cursor-pointer text-gray-50 underline' onClick={handleregisterr}> sign up</button></span>
      </div>
      </div>
    </div>
  );
};

export default Login;
