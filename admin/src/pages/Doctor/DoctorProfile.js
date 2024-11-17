import React, { useContext, useEffect, useState } from "react";
import { doctorcontext } from "../../context/DoctorContext";

const DoctorProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const {
    dToken,
    doctorProfile,
    setDoctorProfile,
    getDoctorProfile,
    updateDoctorProfile,  // Assuming you have an update function in context
    backendUrl,
  } = useContext(doctorcontext);

  useEffect(() => {
    if (dToken) {
      getDoctorProfile();
    }
  }, [dToken]);

  const handleAvailabilityChange = (e) => {
    setDoctorProfile(prev => ({
      ...prev,
      available: e.target.checked,
    }));
  };

  const handleSave = () => {
    if (doctorProfile.fees && doctorProfile.available !== undefined) {
      updateDoctorProfile(doctorProfile);  // Assuming you have a function to update the profile
      setIsEdit(false);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    doctorProfile && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={doctorProfile.image}
              alt="Doctor"
            />
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {doctorProfile.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {doctorProfile.degree}-{doctorProfile.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {doctorProfile.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About
              </p>
              <p>{doctorProfile.about}</p>
            </div>

            <p className="text-gray-600 font-medium mt-4">
              Appointment Fee:
              <span className="text-gray-800">
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) => {
                      setDoctorProfile((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }));
                    }}
                    value={doctorProfile.fees}
                  />
                ) : (
                  doctorProfile.fees
                )}
              </span>
              /-
            </p>

            <div className="flex gap-2 py-2">
              <p>Address</p>
              <p>
                {doctorProfile.address.line1 || "No address provided"}
                <br />
                {doctorProfile.address.line2 || ""}
              </p>
            </div>

            <div className="flex gap-1 pt-2 items-center mb-4">
              <input
                checked={doctorProfile.available}
                onChange={handleAvailabilityChange}
                type="checkbox"
                name="available"
                id="available"
                className="mr-2"
              />
              <label htmlFor="available" className="text-sm">
                Available
              </label>
            </div>

            <div className="flex gap-2">
              {isEdit ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1 border border-primary text-sm rounded-full mt-5 ml-2 hover:bg-primary hover:text-white transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEdit(false)}
                    className="px-4 py-1 border text-sm rounded-full mt-5 ml-2 hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-4 py-1 border border-primary text-sm rounded-full mt-5 ml-2 hover:bg-primary hover:text-white transition-all"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
