import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const doctorcontext = createContext();

const DoctorcontextProvider = (props) => {
  const backendUrl = "http://localhost:5000";

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [doctorStats, setDoctorStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

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

  const getDoctorDashboard = async () => {
    setLoadingStats(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/doctor-dashboard`, {
        headers: { dtoken: dToken },
      });
      if (data.success) {
        setDoctorStats(data.dashData);
      } else {
        toast.error(data.message || "Failed to fetch doctor dashboard");
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch doctor dashboard");
    } finally {
      setLoadingStats(false);
    }
  };

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

  const getDoctorProfile = async () => {
    setLoadingProfile(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/get-profile`, {
        headers: { dtoken: dToken },
      });
      if (data.success) {
        setDoctorProfile(data.doctor);
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

  const editDoctorProfile = async (updatedProfile) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/edit-profile`,
        updatedProfile,
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        setDoctorProfile(data.doctor);
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

  useEffect(() => {
    if (dToken) {
      getDoctorDashboard();
    } else {
      toast.error("Doctor not authenticated");
    }
  }, [dToken]);

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

  return <doctorcontext.Provider value={value}>{props.children}</doctorcontext.Provider>;
};

export default DoctorcontextProvider;
