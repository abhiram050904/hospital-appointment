import React, { useContext } from 'react';
import Appcontext from '../context/Appcontext';
import { doctors } from '../assets/assets';

const Myappointments = () => {
  return (
    <div className='max-w-lg mx-auto p-4'>
      <h2 className='text-xl font-bold mb-4'>My Appointments</h2>
      <div className='space-y-4'>
        {doctors.slice(0, 2).map((item, index) => (
          <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'>
            <div className='flex-shrink-0'>
              <img className='w-32 bg-indigo-50' src={item.image} alt={item.name} />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.name}</p>
              <p className='text-sm text-gray-600'>{item.speciality}</p>
              <p className='text-zinc-700 font-medium'>Address:</p>
              <p className='text-xs'>{item.address.line1}</p>
              <p className='text-xs'>{item.address.line2}</p>
              <p className='text-xs mt-1'>
                <span className='text-xs text-neutral-700 font-medium'>Date & Time:</span> 2 August, 2024 | 8:00 AM
              </p>
            </div>
            <div className='flex flex-col justify-end gap-2'>
              <button className='text-sm text-white bg-green-600 hover:bg-green-700 transition duration-300 ease-in-out py-2 rounded shadow-lg transform hover:scale-105'>
                Pay Online
              </button>
              <button className='text-sm text-white bg-red-600 hover:bg-red-700 transition duration-300 ease-in-out py-2 px-2 rounded shadow-lg transform hover:scale-105'>
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Myappointments;
