import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AdmincontextProvider from './context/AdminContext';
import AppcontextProvider from './context/AppContext';
import DoctorcontextProvider from './context/DoctorContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AdmincontextProvider>
    <DoctorcontextProvider>
    <AppcontextProvider>
    <App />
    </AppcontextProvider>
    </DoctorcontextProvider>
    </AdmincontextProvider>
  </React.StrictMode>
);
