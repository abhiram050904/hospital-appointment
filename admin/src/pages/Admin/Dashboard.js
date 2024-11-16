import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

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

const Dashboard = () => {
  const { adminData, getDashData, aToken, appointments = [], cancelAppointment, loading } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken, getDashData]);

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-2-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.doctor_icon} alt="Doctors" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{adminData.doctors}</p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-2-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointment_icon} alt="Appointments" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{adminData.appointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-2-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.people_icon} alt="Patients" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{adminData.patients}</p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon} alt="List" />
          <p className="font-semibold">ALL BOOKINGS</p>
        </div>

        <div className="pt-4 border border-t-0">
          {/* Appointments list starts here */}
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
                  onClick={() => !item.cancelled && cancelAppointment(item._id)}
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
    </div>
  );
};

export default Dashboard;
