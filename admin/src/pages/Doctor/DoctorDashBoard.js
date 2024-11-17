import React, { useContext, useEffect } from "react";
import { doctorcontext } from "../../context/DoctorContext";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const DoctorDashboard = () => {
  const { dToken, getDoctorDashboard, doctorStats, loadingStats, cancelAppointment, markAppointmentComplete } = useContext(doctorcontext);

  useEffect(() => {
    if (dToken && !doctorStats) {
      getDoctorDashboard()
        .catch((error) => toast.error("Error fetching dashboard data"));
    } else if (!dToken) {
      toast.error("Doctor not authenticated");
    }
  }, [dToken, doctorStats, getDoctorDashboard]);

  if (loadingStats) {
    return (
      <div className="flex justify-center items-center">
        <div className="spinner">Loading dashboard...</div>
      </div>
    );
  }

  const handleCancelAppointment = (appointmentId) => {
    toast.info(`Appointment with ID: ${appointmentId} is being cancelled.`);
    cancelAppointment(appointmentId)
      .then(() => {
        toast.success("Appointment cancelled successfully");
        // Refresh data after cancellation
        getDoctorDashboard();
      })
      .catch(() => toast.error("Failed to cancel appointment"));
  };

  const handleCompleteAppointment = (appointmentId) => {
    toast.info(`Appointment with ID: ${appointmentId} is being marked as complete.`);
    markAppointmentComplete(appointmentId)
      .then(() => {
        toast.success("Appointment marked as completed");
        // Refresh data after completion
        getDoctorDashboard();
      })
      .catch(() => toast.error("Failed to mark appointment as completed"));
  };

  return (
    <div className="m-5">
      {/* Dashboard Stats */}
      <div className="flex gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-56 hover:scale-105 transition-transform">
          <img className="w-14 mb-4" src={assets.earning_icon} alt="Earnings" />
          <h3 className="text-lg font-semibold">Earnings</h3>
          <p className="text-gray-600">₹{doctorStats?.earnings?.toLocaleString() || 0}</p> {/* Format earnings as rupees */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-56 hover:scale-105 transition-transform">
          <img className="w-14 mb-4" src={assets.appointments_icon} alt="Appointments" />
          <h3 className="text-lg font-semibold">Total Appointments</h3>
          <p className="text-gray-600">{doctorStats?.appointments || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-56 hover:scale-105 transition-transform">
          <img className="w-14 mb-4" src={assets.patients_icon} alt="Patients" />
          <h3 className="text-lg font-semibold">Total Patients</h3>
          <p className="text-gray-600">{doctorStats?.patients || 0}</p>
        </div>
      </div>

      {/* Latest Appointments */}
      <h3 className="text-2xl font-semibold mb-4">Latest Appointments</h3>
      <ul>
        {doctorStats?.latestAppointments?.map((appointment) => (
          <li key={appointment._id} className="bg-white p-4 mb-4 rounded-lg shadow-md flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src={appointment.userData?.image || "/placeholder-image.jpg"}
                alt={`${appointment.userData?.name || "Patient"}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p>{appointment.userData?.name || "N/A"}</p>
            </div>
            <div className="text-center">
              <p>{appointment.slotDate} {appointment.slotTime}</p>
              <p
                className={`font-semibold ${
                  appointment.cancelled
                    ? "text-gray-500"
                    : appointment.isCompleted
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {appointment.cancelled
                  ? "Cancelled"
                  : appointment.isCompleted
                  ? "Completed"
                  : "Pending"}
              </p>
            </div>
            {/* Cancel Button */}
            {!(appointment.isCompleted || appointment.cancelled) && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                onClick={() => handleCancelAppointment(appointment._id)}
              >
                Cancel Appointment
              </button>
            )}
            {/* Complete Button */}
            {!(appointment.isCompleted || appointment.cancelled) && (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                onClick={() => handleCompleteAppointment(appointment._id)}
              >
                Complete Appointment
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorDashboard;
