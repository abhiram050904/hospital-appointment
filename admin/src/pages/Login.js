import React, { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import validator from 'validator';

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAToken, backendUrl } = useContext(AdminContext);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Simple client-side validation
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validator.isEmail(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true); 
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });

        setLoading(false);
        if (data.success) {
          console.log(data.token);
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
          toast.success('Login successful!');
        } else {
          toast.error(data.message);
          console.log(data.message);
        }
      } else {
        
      }
    } catch (err) {
      setLoading(false);
      if (err.response) {
        toast.error(err.response.data.message || 'Login failed');
        console.log(err.response.data.message);
      } else {
        toast.error('An error occurred. Please try again later');
        console.log(err.message);
      }
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-primary'>{state}</span> Login
        </p>
        <div className='w-full'>
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='email'
            required
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='password'
            required
          />
        </div>
        <button
          className='bg-primary text-white w-full py-2 rounded-md text-base'
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {state === 'Admin' ? (
          <p>
            Doctor Login?{' '}
            <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')}>
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{' '}
            <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
