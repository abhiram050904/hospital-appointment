import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments,setAppointments]=useState([])
  const [adminData,setAdminData]=useState([])

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { aToken },
      });
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error("Failed to fetch doctors");
      }
    } catch (err) {
      toast.error("An error occurred while fetching doctors");
      console.error("Error fetching doctors:", err);
    }
  };


  const changeAvailability=async(docdata)=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/admin/change-availability`,{docdata},{headers:{aToken}})

      if(data.success)
      {
        toast.success(data.message)
        console.log(data)
        getAllDoctors()
      }
      else{
        toast.error(data.message)
      }
    }
    catch(err){
        console.log(err)
        toast.error(err.message)
    }
  }


  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/all-appointments`,
        { headers: {aToken } }
      );

      if (data.success) {
        setAppointments(data.appointments);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error(err.message);
    }
  };


  const cancelAppointment=async(appointmentId)=>{

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/delete-appointment`,{appointmentId},
        { headers: {aToken } }
      );

      if (data.success) {
        setAppointments(data.appointments);
        console.log(data);
        toast.success(data.message)
      } else {
        toast.error(data.message);
      }
    } 
    catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error(err.message);
    }
  }


  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-data`, {
        headers: { aToken },
      });
  
      if (data.success) {
        console.log(data);
        setAdminData(data.dashData)
      } else {
        toast.error("Failed to fetch dashboard data.");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      toast.error("An error occurred while fetching dashboard data.");
    }
  };
  
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,setAppointments,
    getAppointments,
    cancelAppointment,
    adminData,
    getDashData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
