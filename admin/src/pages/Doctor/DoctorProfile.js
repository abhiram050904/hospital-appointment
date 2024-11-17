import React, { useContext, useState, useEffect } from 'react';
import { doctorcontext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { doctorProfile, setDoctorProfile, dToken, loadDoctorProfileData } = useContext(doctorcontext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Image preview state

  const backendUrl = 'http://localhost:5000';

  // Function to handle doctor profile updates
  const updateDoctorProfileData = async () => {
    try {
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      formData.append('doctorId', doctorProfile._id);
      formData.append('name', doctorProfile.name);
      formData.append('speciality', doctorProfile.speciality);
      formData.append('fees', doctorProfile.fees);
      formData.append('available', doctorProfile.available);
      formData.append('address', JSON.stringify(doctorProfile.address));

      const { data } = await axios.post(`${backendUrl}/api/doctor/edit-profile`, formData, {
        headers: { token: dToken },
      });

      if (data.success) {
        toast.success(data.message);
        // Reload the updated doctor profile data
        await loadDoctorProfileData();  // Refresh doctor data from the backend
        setIsEdit(false);  // Exit edit mode
        setImage(null);  // Reset image state
        setImagePreview(null);  // Reset image preview
      } else {
        alert(data.message);  // Show error message if update fails
      }
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      alert('Error updating profile. Please try again.');
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create an immediate image preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Show loading message if doctorProfile is still loading
  if (!doctorProfile) {
    return <div className="text-center text-lg font-semibold">Loading profile...</div>;
  }

  return doctorProfile && (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl flex flex-col gap-6">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <img
          className="w-36 h-36 rounded-full border-4 border-primary object-cover"
          src={imagePreview || doctorProfile.image || '/defaultProfileImage.png'}
          alt="Doctor Profile"
        />
        {isEdit && (
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-4 cursor-pointer text-sm text-primary file:py-2 file:px-4 file:rounded-full file:border-2 file:border-primary file:text-primary file:hover:bg-primary file:hover:text-white"
          />
        )}

        {/* Doctor's Name */}
        {isEdit ? (
          <input
            className="mt-4 text-3xl font-semibold text-neutral-900 bg-transparent border-b-2 border-gray-300 focus:border-primary focus:outline-none"
            type="text"
            value={doctorProfile.name}
            onChange={(e) => setDoctorProfile((prev) => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <p className="mt-4 text-3xl font-semibold text-neutral-800">{doctorProfile.name || 'Anonymous'}</p>
        )}
      </div>

      <hr className="border-t-2 border-gray-300" />

      <div>
        {/* Contact Information */}
        <p className="text-xl font-semibold text-neutral-700">Contact Information</p>
        <div className="grid grid-cols-[1fr_3fr] gap-3 mt-3 text-neutral-700">
          {/* Email */}
          <p className="font-medium">Email:</p>
          <p className="text-blue-500">{doctorProfile.email || 'Not provided'}</p>

          {/* Phone */}
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 p-2 rounded-lg"
              type="text"
              value={doctorProfile.phone || ''}
              onChange={(e) => setDoctorProfile((prev) => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <p className="text-blue-400">{doctorProfile.phone || 'Not provided'}</p>
          )}

          {/* Address */}
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <>
              <input
                className="bg-gray-100 p-2 rounded-lg"
                type="text"
                value={doctorProfile.address?.line1 || ''}
                onChange={(e) =>
                  setDoctorProfile((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                placeholder="Address line 1"
              />
              <br />
              <input
                className="bg-gray-100 p-2 rounded-lg"
                type="text"
                value={doctorProfile.address?.line2 || ''}
                onChange={(e) =>
                  setDoctorProfile((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                placeholder="Address line 2"
              />
            </>
          ) : (
            <p className="text-gray-500">
              {doctorProfile.address?.line1 || 'N/A'}
              <br />
              {doctorProfile.address?.line2 || ''}
            </p>
          )}
        </div>
      </div>

      <div>
        {/* Speciality and Fees */}
        <p className="text-xl font-semibold text-neutral-700">Speciality & Fees</p>
        <div className="grid grid-cols-[1fr_3fr] gap-3 mt-3 text-neutral-700">
          <p className="font-medium">Speciality:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 p-2 rounded-lg"
              type="text"
              value={doctorProfile.speciality || ''}
              onChange={(e) => setDoctorProfile((prev) => ({ ...prev, speciality: e.target.value }))}
            />
          ) : (
            <p className="text-gray-500">{doctorProfile.speciality || 'Not provided'}</p>
          )}

          <p className="font-medium">Fees:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 p-2 rounded-lg"
              type="number"
              value={doctorProfile.fees || ''}
              onChange={(e) => setDoctorProfile((prev) => ({ ...prev, fees: e.target.value }))}
            />
          ) : (
            <p className="text-gray-500">{doctorProfile.fees || 'Not provided'}</p>
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
            onChange={() => setDoctorProfile((prev) => ({
              ...prev,
              available: !prev.available,
            }))}
            disabled={!isEdit}
            className="mr-3 w-6 h-6 border-primary text-primary rounded-full cursor-pointer"
          />
          <span className="text-gray-600">Available for appointments</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={updateDoctorProfileData}  // Trigger update when saving
          >
            Save Information
          </button>
        ) : (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={() => setIsEdit(true)}  // Switch to edit mode
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
