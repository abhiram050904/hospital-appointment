import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Appcontext } from '../context/Appcontext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, Currency_symbol, getDoctorsData, token } = useContext(Appcontext);
  const navigate = useNavigate();

  const backendUrl = 'http://localhost:5000'; // Replace with your backend URL
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  // Fetch doctor details from the context
  const fetchDocInfo = async () => {
    if (doctors) {
      const doctor = doctors.find((doc) => doc._id === docId);
      setDocInfo(doctor);
    }
  };

  // Generate available time slots for the next 7 days
  const getAvailableSlots = async () => {
    const newDocSlots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      newDocSlots.push(timeSlots);
    }

    setDocSlots(newDocSlots);
  };

  // Book an appointment
  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book an appointment.');
      return navigate('/login');
    }

    if (!slotTime) {
      toast.warn('Please select a time slot.');
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);

        // Update the booked slots in the state
        setDocInfo((prevDocInfo) => {
          const updatedSlots = { ...prevDocInfo.slots_booked };

          if (!updatedSlots[slotDate]) {
            updatedSlots[slotDate] = [];
          }
          updatedSlots[slotDate].push(slotTime);

          return {
            ...prevDocInfo,
            slots_booked: updatedSlots,
          };
        });

        // Refresh slots to hide the booked one
        getAvailableSlots();
        navigate('/my-appointments')
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to book appointment.';
      console.error('Error booking appointment:', errorMessage);
      toast.error(errorMessage);
    }
  };

  // Effects
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        {/* Doctor details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt={`${docInfo.name}`} />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-grey-900">
              {docInfo.name} <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About: <img src={assets.info_icon} alt="Info" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
            </div>
            <div className="flex flex-row">
              <p className="text-sm text-gray-900 font-medium mt-3">Appointment Fee:</p>
              <div className="flex flex-row mt-3">
                <p className="mt-1">{Currency_symbol}</p>
                <p>{docInfo.fees}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map(
                (item, index) =>
                  item.length > 0 && (
                    <div
                      onClick={() => setSlotIndex(index)}
                      className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                        slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'
                      }`}
                      key={index}
                    >
                      <p>{daysOfWeek[item[0].datetime.getDay()]}</p>
                      <p>{item[0].datetime.getDate()}</p>
                    </div>
                  )
              )}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? (
              docSlots[slotIndex].map((item, index) => (
                <p
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'
                  }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No available slots for this day.</p>
            )}
          </div>

          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-3"
          >
            Book an Appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
