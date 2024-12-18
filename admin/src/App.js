import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin/Dashboard'
import AllApointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorList from './pages/Admin/DoctorsList'
import { doctorcontext } from './context/DoctorContext';
import DoctorDashBoard from './pages/Doctor/DoctorDashBoard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(doctorcontext)
  return (
    <BrowserRouter>
      {aToken || dToken ? (
        <div className='bg-[#F8F9FD]'>
          <ToastContainer />
          <Navbar/>
          <div className='flex items-start'>
            <Sidebar/>
            <Routes>
              <Route path='/' element={<></>} />
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/all-appointments' element={<AllApointments />} />
              <Route path='/add-doctor' element={<AddDoctor />} />
              <Route path='/doctor-list' element={<DoctorList />} />


              <Route path='/doctor-dashboard' element={<DoctorDashBoard />} />
              <Route path='/doctor-profile' element={<DoctorProfile />} />
              <Route path='/doctor-appointments' element={<DoctorAppointment />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div>
          <Login />
          <ToastContainer />
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;
