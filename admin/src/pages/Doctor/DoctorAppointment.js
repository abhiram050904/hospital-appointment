import React, { useContext, useEffect, useState, useRef } from "react";
import { doctorcontext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const calculateAge = (dob) => {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age;
};

const DoctorAppointment = () => {
  const {
    dToken,
    appointments = [],
    getAppointments,
    cancelAppointment,
    markAppointmentComplete,
    loading,
  } = useContext(doctorcontext);

  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [loadingAction, setLoadingAction] = useState(null);
  
  const actionRef = useRef({});  // Using ref to track actions, without triggering re-renders.

  // Fetch the appointments only if the token exists
  useEffect(() => {
    if (dToken) {
      getAppointments();  // This will keep appointments updated
    }
  }, [dToken]); // Dependency on dToken

  // Keep localAppointments updated whenever the context appointments change
  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  const handleCancel = async (appointmentId) => {
    setLoadingAction({ id: appointmentId, type: "cancel" });

    // Optimistic UI update: Cancel immediately
    const updatedAppointments = localAppointments.map((appointment) =>
      appointment._id === appointmentId
        ? { ...appointment, cancelled: true }
        : appointment
    );
    setLocalAppointments(updatedAppointments);

    try {
      await cancelAppointment(appointmentId);
      getAppointments();  // Refresh the list of appointments after the action
      toast.success("Appointment cancelled successfully!");
    } catch (error) {
      toast.error("Error cancelling the appointment.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleComplete = async (appointmentId) => {
    setLoadingAction({ id: appointmentId, type: "complete" });

    // Optimistic UI update: Mark as completed immediately
    const updatedAppointments = localAppointments.map((appointment) =>
      appointment._id === appointmentId
        ? { ...appointment, isCompleted: true }
        : appointment
    );
    setLocalAppointments(updatedAppointments);

    try {
      await markAppointmentComplete(appointmentId);
      getAppointments();  // Refresh the list of appointments after the action
      toast.success("Appointment completed successfully!");
    } catch (error) {
      toast.error("Error completing the appointment.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">Your Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fee</p>
          <p>Status</p>
          <p>Cancel</p>
          <p>Complete</p>
        </div>
        {localAppointments.length > 0 ? (
          localAppointments.map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr_1fr_1fr] items-center text-gray-500 px-3 py-6 border-b hover:bg-gray-100"
              key={item._id || index}
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img
                  src={item.userData?.image || "/placeholder-image.jpg"}
                  alt={`${item.userData?.name || "Patient"}'s avatar`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p>{item.userData?.name || "N/A"}</p>
              </div>
              <p>{calculateAge(item.userData?.dob)}</p>
              <p>
                {item.slotDate || "N/A"} {item.slotTime || ""}
              </p>
              <p>{item.amount ? `₹${item.amount}` : "N/A"}</p>
              <p
                className={item.cancelled ? "text-red-500" : item.isCompleted ? "text-blue-500" : "text-green-500"}
              >
                {item.cancelled ? "Cancelled" : item.isCompleted ? "Completed" : "Confirmed"}
              </p>
              <button
                className={`px-3 py-1 rounded ${
                  item.cancelled
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                disabled={item.cancelled || item.isCompleted || actionRef.current.id === item._id}
                onClick={() => !item.cancelled && handleCancel(item._id)}
              >
                {actionRef.current.id === item._id && actionRef.current.type === "cancel"
                  ? "Cancelling..."
                  : item.cancelled
                  ? "Cancelled"
                  : item.isCompleted
                  ? "Completed"
                  : "Cancel"}
              </button>
              
              <div className="ml-3">
                <button
                  className={`px-3 py-1 rounded ${
                    item.cancelled
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : item.isCompleted
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  disabled={item.cancelled || item.isCompleted || actionRef.current.id === item._id}
                  onClick={() => !item.isCompleted && handleComplete(item._id)}
                >
                  {actionRef.current.id === item._id && actionRef.current.type === "complete"
                    ? "Completing..."
                    : item.isCompleted
                    ? "Completed"
                    : "Complete"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-4 text-gray-600">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
