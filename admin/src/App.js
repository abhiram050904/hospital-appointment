import React, { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
const App = () => {
  const { aToken } = useContext(AdminContext);

  return (
    <BrowserRouter>
      {aToken ? (
        <div className='bg-[#F8F9FD]'>
          <ToastContainer />
          <Navbar/>
          <div className='flex items-start'>
            <Sidebar/>
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
