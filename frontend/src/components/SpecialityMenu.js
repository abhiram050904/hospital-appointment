import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center mt-20 gap-4 py-1 text-gray-800' id='speciality'>
      <h1 className='text-3xl font-medium'>Find the speciality</h1>
      <p className='sm:w-1/3 text-center text-sm'>Browse through our list of specialists and find the ones that suit you the most</p>
      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
        {specialityData.map((item) => (
          <Link 
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:-translate-y-2 transition-all duration-500"  
            key={item.speciality} // Use unique identifier
            to={`/doctors/${item.speciality}`}
          >
            <img 
              className='w-16 sm:w-24 mb-2' 
              src={item.image} 
              alt={`${item.speciality} specialist`} // Descriptive alt text
              onError={(e) => { e.target.src = 'path/to/fallback/image.jpg'; }} // Fallback image
            />
            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SpecialityMenu;
