import React, { useContext, useState, useEffect } from "react";
import { doctorcontext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { doctorProfile, setDoctorProfile, dToken, getDoctorProfile } =
    useContext(doctorcontext);
  const [isEdit, setIsEdit] = useState(false);

  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    if (dToken) {
      getDoctorProfile();
    }
  }, [dToken]);

  // Function to update doctor profile
  const updateDoctorProfileData = async () => {
    try {
      const updatedProfile = {
        fees: doctorProfile.fees,
        available: doctorProfile.available,
        address: doctorProfile.address,
        about: doctorProfile.about, // Include the about field
      };

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/edit-profile`,
        updatedProfile,
        { headers: { dtoken: dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error updating profile. Please try again.");
    }
  };

  if (!doctorProfile) {
    return (
      <div className="text-center text-lg font-semibold">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl flex flex-col gap-6">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <img
          className="w-36 h-36 rounded-full border-4 border-primary object-cover"
          src={doctorProfile.image || "/defaultProfileImage.png"}
          alt="Doctor Profile"
        />
        <p className="mt-4 text-3xl font-semibold text-neutral-800">
          {doctorProfile.name || "Anonymous"}
        </p>
      </div>

      <hr className="border-t-2 border-gray-300" />

      <div>
        {/* Speciality */}
        <p className="text-xl font-semibold text-neutral-700">Speciality</p>
        <div className="mt-3 text-neutral-700">
          <p className="text-gray-500">{doctorProfile.speciality || "Not provided"}</p>
        </div>
      </div>

      <div>
        {/* Email */}
        <p className="text-xl font-semibold text-neutral-700">Email</p>
        <div className="mt-3 text-neutral-700">
          <p className="text-gray-500">{doctorProfile.email || "Not provided"}</p>
        </div>
      </div>

      <div>
        {/* About */}
        <p className="text-xl font-semibold text-neutral-700">About</p>
        <div className="mt-3 text-neutral-700">
          {isEdit ? (
            <textarea
              className="bg-gray-100 p-2 rounded-lg w-full"
              rows="4"
              value={doctorProfile.about || ""}
              onChange={(e) =>
                setDoctorProfile((prev) => ({
                  ...prev,
                  about: e.target.value,
                }))
              }
              placeholder="Write about yourself..."
            />
          ) : (
            <p className="text-gray-500">{doctorProfile.about || "Not provided"}</p>
          )}
        </div>
      </div>

      <div>
        {/* Fees */}
        <p className="text-xl font-semibold text-neutral-700">Fees</p>
        <div className="grid grid-cols-[1fr_3fr] gap-3 mt-3 text-neutral-700">
          <p className="font-medium">Fees:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 p-2 rounded-lg"
              type="number"
              value={doctorProfile.fees || ""}
              onChange={(e) =>
                setDoctorProfile((prev) => ({
                  ...prev,
                  fees: e.target.value,
                }))
              }
            />
          ) : (
            <p className="text-gray-500">{doctorProfile.fees || "Not provided"}</p>
          )}
        </div>
      </div>

      <div>
        {/* Availability */}
        <p className="text-xl font-semibold text-neutral-700">Availability</p>
        <div className="flex items-center mt-3">
          <input
            type="checkbox"
            checked={doctorProfile.available || false}
            onChange={() =>
              setDoctorProfile((prev) => ({
                ...prev,
                available: !prev.available,
              }))
            }
            disabled={!isEdit}
            className="mr-3 w-6 h-6 border-primary text-primary rounded-full cursor-pointer"
          />
          <span className="text-gray-600">Available for appointments</span>
        </div>
      </div>

      <div>
        {/* Address */}
        <p className="text-xl font-semibold text-neutral-700">Address</p>
        <div className="grid grid-cols-[1fr_3fr] gap-3 mt-3 text-neutral-700">
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div className="flex flex-col gap-2">
              <input
                className="bg-gray-100 p-2 rounded-lg"
                type="text"
                value={doctorProfile.address?.line1 || ""}
                onChange={(e) =>
                  setDoctorProfile((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                placeholder="Address line 1"
              />
              <input
                className="bg-gray-100 p-2 rounded-lg"
                type="text"
                value={doctorProfile.address?.line2 || ""}
                onChange={(e) =>
                  setDoctorProfile((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                placeholder="Address line 2"
              />
            </div>
          ) : (
            <p className="text-gray-500">
              {doctorProfile.address?.line1 || "N/A"}
              <br />
              {doctorProfile.address?.line2 || ""}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={updateDoctorProfileData}
          >
            Save Information
          </button>
        ) : (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
