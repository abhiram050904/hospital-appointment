import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Myprofile = () => {
  const [userData, setUserData] = useState({
    name: 'Abhiram',
    image: assets.profile_pic,
    email: 'abc@gmail.com',
    phone: '+91 1234567891',
    Address: {
      line1: 'benz circle, vijayawada',
      line2: 'Andhra Pradesh'
    },
    gender: 'Male',
    dob: '2004-09-05'
  });

  const [isEdit, setIsEdit] = useState(true);

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      <div>
        <h2>Profile</h2>
        <img className='w-36 rounded' src={userData.image} alt="Profile" />

        {/* Name */}
        {isEdit ? (
          <input 
            className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
            type='text' 
            value={userData.name} 
            onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <p className='font-medium text-3xl text-neutral-800 mt-4'>Name: {userData.name}</p>
        )}

        <hr className='bg-zinc-400 h-[1px] border-none' />
        <p className='text-neutral-500 underline mt-3'>Contact Information</p>
        
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          {/* Email */}
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>

          {/* Phone */}
          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input
              className='bg-gray-100 max-w-52'
              type='text' 
              value={userData.phone} 
              onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <p className='text-blue-400'>{userData.phone}</p>
          )}

          {/* Address */}
          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <>
              <input
                className='bg-gray-100 max-w-full' // Added class for consistent styling
                type='text' 
                value={userData.Address.line1} 
                onChange={(e) => setUserData(prev => ({ 
                  ...prev, Address: { ...prev.Address, line1: e.target.value } 
                }))}
                placeholder="Address line 1"
              />
              <br />
              <input
                className='bg-gray-100 max-w-full' // Added class for consistent styling
                type='text' 
                value={userData.Address.line2} 
                onChange={(e) => setUserData(prev => ({ 
                  ...prev, Address: { ...prev.Address, line2: e.target.value } 
                }))}
                placeholder="Address line 2"
              />
            </>
          ) : (
            <p className='text-gray-500'> {userData.Address.line1}<br /> {userData.Address.line2}</p>
          )}
        </div>

        {/* Basic Information */}
        <div>
        <p className='text-neutral-500 underline mt-3'>Basic Information</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>Gender:</p>
            {isEdit ? (
              <select className='max-w-20 bg-gray-100' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className='text-gray-400'>{userData.gender}</p>
            )}

            {/* Birthday */}
            <p className='font-medium'>Birthday:</p>
            {isEdit ? (
              <input
              className='max-w-28 bg-gray-100' 
                type="date" 
                value={userData.dob} 
                onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
              />
            ) : (
              <p className='text-gray-400'>{userData.dob}</p>
            )}
          </div>
        </div>
      </div>

      <div className='mt-10'>
        {isEdit ? (
          <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(false)}>Save Information</button>
        ) : (
          <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default Myprofile;
