import React, { useContext, useState, useEffect } from 'react';
import { Appcontext } from '../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Myprofile = () => {
  const { userData, setUserData, token, loadUserProfileData } = useContext(Appcontext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State to store image preview

  const backendUrl = 'http://localhost:5000';

  // This function updates the user's profile data
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      formData.append('userId', userData._id);
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('dob', userData.dob);
      formData.append('gender', userData.gender);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        // Reload the updated user profile data
        await loadUserProfileData();  // Refresh user data from the backend
        setIsEdit(false);  // Exit edit mode
        setImage(null);  // Reset image state
        setImagePreview(null);  // Reset image preview
      } else {
        alert(data.message);  // Show error message if update fails
      }
    } catch (err) {
      console.error("Error updating user profile:", err);
      alert("Error updating profile. Please try again.");
    }
  };

  // This function handles the image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview of the image immediately
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // If userData is still loading, show a loading message
  if (!userData) {
    return <div>Loading profile...</div>;
  }

  return userData && (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <div>
        {/* Profile Image */}
        <img
          className="w-36 rounded"
          src={imagePreview || userData.image || '/defaultProfileImage.png'}
          alt="Profile"
        />
        {isEdit && (
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-4"
          />
        )}

        {/* Name */}
        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
            type="text"
            value={userData.name}
            onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name || 'Anonymous'}</p>
        )}

        <hr className="bg-zinc-400 h-[1px] border-none" />
        <p className="text-neutral-500 underline mt-3">Contact Information</p>

        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          {/* Email */}
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email || 'Not provided'}</p>

          {/* Phone */}
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={userData.phone || ''}
              onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))} />
          ) : (
            <p className="text-blue-400">{userData.phone || 'Not provided'}</p>
          )}

          {/* Address */}
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <>
              <input
                className="bg-gray-100 max-w-full"
                type="text"
                value={userData.address?.line1 || ''}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                placeholder="Address line 1"
              />
              <br />
              <input
                className="bg-gray-100 max-w-full"
                type="text"
                value={userData.address?.line2 || ''}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                placeholder="Address line 2"
              />
            </>
          ) : (
            <p className="text-gray-500">
              {userData.address?.line1 || 'N/A'}
              <br />
              {userData.address?.line2 || ''}
            </p>
          )}
        </div>

        {/* Basic Information */}
        <div>
          <p className="text-neutral-500 underline mt-3">Basic Information</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="max-w-20 bg-gray-100"
                onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                value={userData.gender || 'Male'}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-400">{userData.gender || 'N/A'}</p>
            )}

            {/* Birthday */}
            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100"
                type="date"
                value={userData.dob || ''}
                onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))} />
            ) : (
              <p className="text-gray-400">{userData.dob || 'N/A'}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={updateUserProfileData}  // Trigger update when saving
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

export default Myprofile;
