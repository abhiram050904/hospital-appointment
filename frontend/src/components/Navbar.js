import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-300">
      <img className="w-44 cursor-pointer" src={assets.logo} alt="Logo" />

      {/* Navigation Links */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/" className="py-1">
          HOME
        </NavLink>
        <NavLink to="/doctors" className="py-1">
          ALL DOCTORS
        </NavLink>
        <NavLink to="/about" className="py-1">
          ABOUT
        </NavLink>
        <NavLink to="/contact" className="py-1">
          CONTACT
        </NavLink>
      </ul>

      {/* Profile or Create Account Button */}
      <div className="flex items-center gap-4">
        {
            token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="Profile" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown Icon" />
            
            <div className="absolute top-0 right-0 pt-14 text-base font-medium texxt-gray-600 z-20 hidden group-hover:block">

                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={()=>navigate('profile')} className="p-2 hover:text-black hover:text-lg hover:font-semibold cursor-pointer">My Profile</p>
                <p onClick={()=>navigate('my-appointments')} className="p-2 hover:text-black hover:text-lg hover:font-semibold cursor-pointer">My Appointments</p>
                <p onClick={()=>navigate()} className="p-2 hover:text-black hover:text-lg hover:font-semibold cursor-pointer">Log Out</p>
                </div>
            </div>

          </div>
        ) 
        :
         (
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-blue-500 text-white rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )
        }
      </div>
    </div>
  );
};

export default Navbar;
