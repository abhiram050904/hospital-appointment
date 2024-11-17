import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { doctorcontext } from '../context/DoctorContext';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(doctorcontext);

  const navigate = useNavigate();

  const LogOut = () => {
    if (aToken) {
      setAToken('');
      localStorage.removeItem('aToken');
    }

    if (dToken) {
      setDToken('');
      localStorage.removeItem('dToken');
    }

    navigate('/');
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img className="w-36 sm:w-40 cursor-pointer" src={assets.admin_logo} alt="Logo" />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken || dToken ? (aToken ? 'Admin' : 'Doctor') : 'Guest'}
        </p>
      </div>
      <button onClick={LogOut} className="bg-primary text-white text-sm px-10 py-2 rounded-full">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
