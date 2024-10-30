import React from 'react';
import { doctors } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Topdoctors = () => {

    const navigate=useNavigate();
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top doctors to Book</h1>
      <p className="text-center text-sm">Find the required specialists here</p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div onClick={()=>navigate(`/appointment/${item._id}`)} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 shadow-lg"
            key={index}
          >
            <img className="bg-blue-50 w-full" src={item.image} alt={`${item.name}, ${item.speciality}`} />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-center text-green-500">
                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                <p>Available</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={()=>{ navigate('/doctors');}} className="mt-10 px-12 py-3 bg-blue-500 text-lg text-white rounded-full hover:bg-blue-600 transition duration-300">
        More
      </button>
    </div>
  );
};

export default Topdoctors;
