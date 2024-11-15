import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { FaRupeeSign } from "react-icons/fa";
import axios from 'axios';

export const Appcontext = createContext();

const AppcontextProvider = (props) => {
  const Currency_symbol = <FaRupeeSign />;
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: { line1: '', line2: '' },
    image: '',
    gender: '',
    dob: ''
  });
  const [token, setToken] = useState(localStorage.getItem('token') || '');
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

  const loadUserProfileData = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, { headers: { token } });
  
      if (data.success) {
        let parsedAddress = {};
        try {
          parsedAddress = data.userData.address ? JSON.parse(data.userData.address) : {};
        } catch (e) {
          console.error("Error parsing address:", e);
          parsedAddress = {};
        }
  
        const parsedUserData = {
          ...data.userData,
          address: parsedAddress || {}  // Ensure address is always an object
        };
        setUserData(parsedUserData);
        toast.success("User profile loaded successfully");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to load user profile";
      toast.error(errorMessage);
      console.error("Error loading user profile:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  useEffect(() => {
    getAllDoctors();

    if (token) {
      loadUserProfileData();
    } else {
      setUserData({
        name: '',
        email: '',
        phone: '',
        address: { line1: '', line2: '' },
        image: '',
        gender: '',
        dob: ''
      });
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setUserData({
      name: '',
      email: '',
      phone: '',
      address: { line1: '', line2: '' },
      image: '',
      gender: '',
      dob: ''
    });
  };

  const value = {
    doctors,
    Currency_symbol,
    isLoading,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    handleLogin,
    handleLogout
  };

  return (
    <Appcontext.Provider value={value}>
      {props.children}
    </Appcontext.Provider>
  );
};

export default AppcontextProvider;
