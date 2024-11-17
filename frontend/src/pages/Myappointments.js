import React, { useContext, useState, useEffect } from "react";
import { Appcontext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'


const Myappointments = () => {
  const backendUrl = "http://localhost:5000";
  const { token, userId } = useContext(Appcontext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const monthNames = [
    "",
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + monthNames[dateArray[1]] + " " + dateArray[2];
  };

  const initPay = (order) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verify-payment', response, { headers: { token } });
          if (data.success) {
            getUserAppointments();
            navigate('/my-appointments');
          }
        } catch (err) {
          console.log(err);
          toast.error(err.message);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/payment`, { appointmentId }, { headers: { token } });

      if (data.success) {
        initPay(data.order);
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Error initiating Razorpay:", err);
    }
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/appointments`,
        { userId },
        { headers: { token } }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments.reverse());
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error(err.message || "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`, 
        { appointmentId, userId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Appointment canceled successfully");
        getUserAppointments();
      } else {
        toast.error(response.data.message || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Error canceling appointment:", err);
      toast.error(err.message || "Error canceling appointment");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">My Appointments</h2>
      <div className="space-y-4">
        {loading ? (
          <div>Loading...</div>
        ) : appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            >
              <div className="flex-shrink-0">
                <img
                  className="w-32 bg-indigo-50"
                  src={item.docData.image}
                  alt={item.docData.name || "Doctor"}
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">
                  {item.docData?.name || "Unknown Doctor"}
                </p>
                <p className="text-sm text-gray-600">{item.docData?.speciality}</p>
                <p className="text-zinc-700 font-medium">Address:</p>
                <p className="text-xs">{item.docData.address?.line1 || "N/A"}</p>
                <p className="text-xs">{item.docData.address?.line2 || "N/A"}</p>
                <p className="text-xs mt-1 text-blue-600">
                  <span className="text-xs text-neutral-700 font-medium">
                    Date & Time:
                  </span>{" "}
                  <br />
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>
              </div>
              <div className="flex flex-col justify-end gap-2">
                {item.isCompleted ? (
                  <button className="text-sm text-white bg-blue-600 cursor-not-allowed py-2 rounded shadow-lg">
                    Completed
                  </button>
                ) : item.cancelled ? (
                  <button className="text-sm mb-12 text-white bg-red-500 cursor-not-allowed py-2 px-2 rounded shadow-lg">
                    Appointment Cancelled
                  </button>
                ) : (
                  <>
                    {item.payment ? (
                      <button className="text-sm text-white bg-green-700 cursor-not-allowed py-2 rounded shadow-lg">
                        Paid
                      </button>
                    ) : (
                      <button onClick={() => appointmentRazorpay(item._id)} className="text-sm text-white bg-green-600 hover:bg-green-700 transition duration-300 ease-in-out py-2 rounded shadow-lg transform hover:scale-105">
                        Pay Online
                      </button>
                    )}
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-white bg-red-600 hover:bg-red-700 transition duration-300 ease-in-out py-2 px-2 rounded shadow-lg transform hover:scale-105"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default Myappointments;
