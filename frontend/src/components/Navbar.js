import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-300">
      <img onClick={() => navigate('/')} className="w-44 cursor-pointer" src={assets.logo} alt="Logo" />

      {/* Navigation Links */}
      <ul className={`hidden md:flex items-start gap-5 font-medium`}>
        <NavLink to="/" activeClassName="text-blue-500" className="relative">
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to="/doctors" activeClassName="text-blue-500" className="relative">
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to="/about" activeClassName="text-blue-500" className="relative">
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to="/contact" activeClassName="text-blue-500" className="relative">
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {
          token ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <img className="w-8 rounded-full" src={assets.profile_pic} alt="Profile" />
              <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown Icon" />

              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('profile')} className="p-2 hover:text-black hover:text-lg hover:font-semibold cursor-pointer">My Profile</p>
                  <p onClick={() => navigate('my-appointments')} className="p-2 hover:text-black hover:text-lg hover:font-semibold cursor-pointer">My Appointments</p>
                  <p onClick={() => setToken(false)} className="p-2 hover:text-black hover:text-lg hover:font-semibold cursor-pointer">Log Out</p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-blue-500 text-white rounded-full font-light hidden md:block"
            >
              Create Account
            </button>
          )
        }
        {/* Menu Icon for Mobile */}
        <img 
          src={assets.menu_icon} 
          alt="Menu Icon" 
          className="w-6 cursor-pointer md:hidden"
          onClick={() => setShowMenu(true)} // Toggle mobile menu
        />
        <div className={`fixed right-0 top-0 bottom-0 z-20 bg-white transition-transform duration-300 ease-in-out transform ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
