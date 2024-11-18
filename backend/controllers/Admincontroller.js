import validator from "validator";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/AppointmentModel.js';
import UserModel from "../models/UserModel.js";

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const image = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !image) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(image.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        console.log(req.body)
        const newDoctor = new doctorModel({
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            image: imageUrl,
            date: Date.now(),
            slots_booked:{},
            available:true
        });

        await newDoctor.save();
        res.status(201).json({ message: "Doctor added successfully", doctor: newDoctor });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "An error occurred while adding the doctor" });
    }
};


const LoginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.status(201).json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
};


const allDoctors=async(req,res)=>{
    try{
        const doctors=await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    }
    catch(err)
    {
        console.log(err)
        res.json({success:false,message:err.message})
    }
}

const changeAvailability=async(req,res)=>{
    try{

        const {docdata}=req.body

        const doctId=docdata._id;
         const doctData=await doctorModel.findById(doctId)
         console.log(doctData)
         await doctorModel.findByIdAndUpdate(doctId,{available:!doctData.available})
        res.json({success:true,message:`Availability changed`})
    }
    catch(err)
    {
            console.log(err)
            res.json({success:false,message:err.message})
    }
}


const appointmentAdmin=async(req,res)=>{
    try{

        const appointments=await appointmentModel.find({})
        res.json({success:true,appointments})
    }
    catch(err){ 

        console.log(err)
        res.json({success:false,message:err.message})

    }
}

const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Appointment ID is required" });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Find the doctor related to the appointment
        const doctor = await doctorModel.findById(appointment.docId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Remove the canceled appointment's slot from the doctor's booked slots
        let slots_booked = doctor.slots_booked;
        const { slotDate, slotTime } = appointment;

        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(time => time !== slotTime);
        }

        // Update the doctor's available slots
        await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked });

        // Mark the appointment as canceled
        appointment.cancelled = true;
        await appointment.save();

        res.json({ success: true, message: "Appointment canceled successfully" });
    } catch (err) {
        console.error("Error in cancelAppointment:", err);
        res.status(500).json({ success: false, message: "Server error, please try again" });
    }
};


const adminDashboard = async (req, res) => {
    try {
      const doctors = await doctorModel.find({});
      const users = await UserModel.find({});
      const appointments = await appointmentModel.find({}).sort({ date: -1 }).limit(5); // Sorting by date descending and limiting to 5 results
  
      const dashData = {
        doctors: doctors.length,
        appointments: appointments.length,
        patients: users.length,
        latestAppointments: appointments,
      };
  
      res.json({ success: true, dashData });
    } catch (err) {
      console.error("Error in adminDashboard:", err);
      res.status(500).json({ success: false, message: "Server error, please try again" });
    }
  };
  

export { addDoctor,LoginAdmin,allDoctors,changeAvailability, appointmentAdmin ,cancelAppointment,adminDashboard };

