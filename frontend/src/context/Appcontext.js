import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { FaRupeeSign } from "react-icons/fa";
import axios from 'axios';

export const Appcontext = createContext();

const AppcontextProvider = (props) => {
  const Currency_symbol = <FaRupeeSign />;
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const[token,setToken]=useState('')
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const getAllDoctors = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Error fetching doctors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  const value = {
    doctors,
    Currency_symbol,
    isLoading,
    token,
    setToken
  };

  return (
    <Appcontext.Provider value={value}>
      {props.children}
    </Appcontext.Provider>
  );
};

export default AppcontextProvider;
