import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

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

const AllAppointments = () => {
  const { aToken, appointments = [], getAppointments, cancelAppointment, loading } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAppointments();
    }
  }, [aToken]);

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor Name</p>
          <p>Fee</p>
          <p>Action</p>
        </div>
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 px-3 py-6 border-b hover:bg-gray-100"
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
              <div className="flex items-center gap-2">
                <img
                  src={item.docData?.image || "/placeholder-image.jpg"}
                  alt={`${item.docData?.name || "Doctor"}'s avatar`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p>{item.docData?.name || "N/A"}</p>
              </div>
              <p>{item.amount ? `₹${item.amount}` : "N/A"}</p>
              <button
                className={`px-3 py-1 rounded ${
                  item.cancelled
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                disabled={item.cancelled}
                onClick={() =>
                  !item.cancelled &&
                  cancelAppointment(item._id)
                }
              >
                {item.cancelled ? "Cancelled" : "Cancel"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
