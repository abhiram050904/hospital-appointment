import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const App = () => {
  return (
    <BrowserRouter>
      <Login />
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
