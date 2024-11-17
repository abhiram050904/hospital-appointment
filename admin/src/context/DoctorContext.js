import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const doctorcontext = createContext();

const DoctorcontextProvider = (props) => {
  const backendUrl = "http://localhost:5000";

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);  // State for doctor profile
  const [doctorStats, setDoctorStats] = useState(null);  // State for Doctor Dashboard data
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false); // State for loading doctor stats
  const [loadingProfile, setLoadingProfile] = useState(false); // State for loading profile

  // Function to fetch appointments
  const getAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/all-appointments`, {
        headers: { dtoken: dToken },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch doctor dashboard stats
  const getDoctorDashboard = async () => {
    setLoadingStats(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/doctor-dashboard`, {
        headers: { dtoken: dToken },
      });

      if (data.success) {
        setDoctorStats(data.dashData);
        console.log(data);
      } else {
        toast.error(data.message || "Failed to fetch doctor dashboard");
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch doctor dashboard");
    } finally {
      setLoadingStats(false);
    }
  };

  // Function to cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/delete-appointment`,
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, cancelled: true }
              : appointment
          )
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to cancel appointment");
    }
  };

  // Function to mark an appointment as complete
  const markAppointmentComplete = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, isCompleted: true }
              : appointment
          )
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to mark appointment as complete");
    }
  };

  // Function to fetch the doctor profile
  const getDoctorProfile = async () => {
    setLoadingProfile(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/get-profile`, {
        headers: { dtoken: dToken },
      });

      if (data.success) {
        setDoctorProfile(data.doctor);
        console.log(data)
        toast.success("Profile fetched successfully");
      } else {
        toast.error(data.message || "Failed to fetch doctor profile");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch doctor profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Function to edit doctor profile
  const editDoctorProfile = async (updatedProfile) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/edit-profile`,
        updatedProfile,
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        setDoctorProfile(data.doctor); // Update profile with the new data
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Failed to update doctor profile");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update doctor profile");
    } finally {
      setLoading(false);
    }
  };

  // UseEffect to call getDoctorDashboard once on component mount
  useEffect(() => {
    if (dToken) {
      getDoctorDashboard();
      getDoctorProfile();
    } else {
      toast.error("Doctor not authenticated");
    }
  }, [dToken]); // Ensure this only runs when the dToken is set or changes

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    doctorProfile,
    setDoctorProfile,
    doctorStats,
    getAppointments,
    getDoctorDashboard,
    cancelAppointment,
    markAppointmentComplete,
    getDoctorProfile,
    editDoctorProfile,
    loading,
    loadingStats,
    loadingProfile,
  };

  return (
    <doctorcontext.Provider value={value}>
      {props.children}
    </doctorcontext.Provider>
  );
};

export default DoctorcontextProvider;
