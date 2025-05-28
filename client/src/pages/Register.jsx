import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleLogin = () => {
    navigate('/login');
  }

  const handleSubmit = async () => {
    const interestsArray = form.interests.split(',').map(item => item.trim());
    const res = await axios.post('/auth/register', { ...form, interests: interestsArray });
    localStorage.setItem('token', res.data.token);
    navigate('/');
  };

  return (
    <div className='bg-black text-gray-100 p-4 flex justify-center items-center h-[100vh] w-[100vw]' >
      <div className='w-[40%] flex flex-col justify-center items-center bg-gray-800 p-[2vw] rounded-lg shadow-lg'>
        {/* <h1 className='text-3xl font-bold mb-4'>SmartLearn AI</h1> */}

        <h2 className='text-3xl font-semibold mb-[0.5vw]'>Register</h2>
        <p className='text-gray-400 mb-4'>Join us to enhance your learning experience!</p>
        <input className='w-[80%] my-[0.5vw] border-2 border-gray-500 p-3 rounded-2xl' name="name" placeholder="Name" onChange={handleChange} /><br />
        <input className='w-[80%] border-2 border-gray-500 p-3 rounded-2xl' name="email" placeholder="Email" onChange={handleChange} /><br />
        <input className='w-[80%] border-2 border-gray-500 p-3 rounded-2xl' type="password" name="password" placeholder="Password" onChange={handleChange} /><br />
        <textarea  rows={4} className='w-[80%] border-2 border-gray-500 p-3 rounded-2xl' name="interests" placeholder="Interests (comma separated)" onChange={handleChange} /><br />
        <button className='bg-gray-500 cursor-pointer  hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow' onClick={handleSubmit}>Register</button>
        <div>
          <span>Already have an account? </span>
          <span><button className='hover:cursor-pointer text-gray-50 underline' onClick={handleLogin}> Login</button></span>
        </div>

      </div>

    </div>
  );
};

export default Register;
