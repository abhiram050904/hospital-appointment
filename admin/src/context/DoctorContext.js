import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import {toast} from 'react-toastify'

export const doctorcontext = createContext();

const DoctorcontextProvider = (props) => {
  const backendUrl = 'http://localhost:5000';

  const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async (docId) => {
    try {
      const {data} = await axios.post(
        `${backendUrl}/api/doctor/all-appointments`,
        { docId},
        {
          headers: {
           dToken
          }
        }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
        toast.success(data.message)
      } else {
        console.error(data.message);
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    getAppointments,
  };

  return (
    <doctorcontext.Provider value={value}>
      {props.children}
    </doctorcontext.Provider>
  );
};

export default DoctorcontextProvider;