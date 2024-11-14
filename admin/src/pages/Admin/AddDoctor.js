import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
const AddDoctor = () => {
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [education, setEducation] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [aboutDoctor, setAboutDoctor] = useState("");
  const [doctorImage, setDoctorImage] = useState(null);

  const { aToken, backendUrl } = useContext(AdminContext);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!doctorImage) {
        return toast.error("Please select an image");
      }

      const formData = new FormData();
      formData.append("name", doctorName);
      formData.append("email", doctorEmail);
      formData.append("password", doctorPassword);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("speciality", speciality);
      formData.append("degree", education);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );
      formData.append("about", aboutDoctor);
      formData.append("image", doctorImage);

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: { aToken },
        }
      );

      toast.success("Doctor added successfully");
      setDoctorName("");
      setDoctorEmail("");
      setDoctorPassword("");
      setExperience("1 Year");
      setFees("");
      setSpeciality("General physician");
      setEducation("");
      setAddress1("");
      setAddress2("");
      setAboutDoctor("");
      setDoctorImage(null);
      // } else {
      //   toast.err(data.message);
      // }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
      console.error("Error adding doctor:", err);
    }
  };

  return (
    <form className="m-5 w-full" onSubmit={handleSubmit}>
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-fill max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={
                doctorImage
                  ? URL.createObjectURL(doctorImage)
                  : assets.upload_area
              }
              alt="Doctor"
            />
          </label>
          <input
            onChange={(e) => setDoctorImage(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> Picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                className="border rounded px-3 py-2"
                type="email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                className="border rounded px-3 py-2"
                type="password"
                value={doctorPassword}
                onChange={(e) => setDoctorPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                className="border rounded px-3 py-2"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>FEES</p>
              <input
                className="border rounded px-3 py-2"
                type="number"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="FEE"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                className="border rounded px-3 py-2"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Degree</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Education"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                placeholder="Address-1"
                required
              />
              <input
                className="border rounded px-3 py-2"
                type="text"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                placeholder="Address-2"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            className="w-full px-4 pt-2 border rounded"
            placeholder="Write about doctor"
            rows={5}
            value={aboutDoctor}
            onChange={(e) => setAboutDoctor(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
