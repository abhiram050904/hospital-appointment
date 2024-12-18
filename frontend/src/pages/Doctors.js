import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Appcontext } from '../context/Appcontext';

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(Appcontext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter,setShowFliter]=useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Display all doctors if no specific specialty is selected, otherwise filter by specialty
    const filteredDoctors = speciality ? doctors.filter(doctor => doctor.speciality === speciality) : doctors;
    setFilterDoc(filteredDoctors);
  }, [doctors, speciality]);

  return (
    <div>
      <p className='text-gray-600'>Browse through specialised doctors</p>
        <button className={`px-3 py-1 border rounded text-sm tranition-all sm:hidden ${showFilter? 'bg-primary text-white':''}`} onClick={()=>setShowFliter(prev=>!prev)}>Filters</button>
        <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex' }`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>GENERAL PHYSICIAN</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>GYNECOLOGIST</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>DERMATOLOGIST</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}>PEDIATRICIANS</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>NEUROLOGIST</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>GASTROENTEROLOGIST</p>
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {
            filterDoc.map((item, index) => (
              <div onClick={() => navigate(`/appointment/${item._id}`)} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 shadow-lg"
                key={index}
              >
                <img className="bg-blue-50 w-full" src={item.image} alt={`${item.name}, ${item.speciality}`} />
                <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center">
                <p className={`w-2 h-2 ${item.available? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                {item.available ?<p className='text-green-500'>Available</p>:<p className='text-grey-500'>Unavailable</p>}
              </div>
                  <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Doctors;
