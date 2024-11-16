import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import UserModel from "../models/UserModel.js";
import appointmentModel from "../models/AppointmentModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password length should be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error("Error in RegisterUser:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Both email and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error in LoginUser:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userData = await User.findById(userId).select("-password");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(userData)
    res.json({ success: true, userData });
  } catch (err) {
    console.error("Error in getUserData:", err);
    res.status(500).json({ message: "Server error, please try again" });

  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ success: false, message: "Data incomplete" });
    }

    // Parse the address as an object directly from the request body
    const parsedAddress = address ? JSON.parse(address) : {};

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address: address, dob, gender },
      { new: true }
    );

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
      const imageUrl = imageUpload.secure_url;

      updatedUser.image = imageUrl;
      await updatedUser.save();
    }

    res.json({ success: true, message: "Profile updated", userData: updatedUser });
  } catch (err) {
    console.error("Error in updateProfile:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};



const bookAppointment=async(req,res)=>{
  try{

    const {userId,docId,slotDate,slotTime}=req.body

    const docData=await doctorModel.findById(docId).select('-password')

    if(!docData.available)
    {
      return res.json({success:false,message:'doctor not available'})
    }

    let slots_booked=docData.slots_booked

    if(slots_booked[slotDate]){
      if(slots_booked[slotDate].includes(slotTime)){
        return res.json({success:false,message:'slot not available'})
      }
      else{
        slots_booked[slotDate].push(slotTime)
      }
    }
    else{
      slots_booked[slotDate]=[]
      slots_booked[slotDate].push(slotTime)
    }


    const userData=await UserModel.findById(userId).select('-password')

    delete docData.slots_booked


    const appointmentData={
      userId,docId,userData,docData,amount:docData.fees,slotDate,slotTime,date:Date.now()
    }

    const newappointment=new appointmentModel(appointmentData)

    const dataaa=await newappointment.save()

    console.log(dataaa)
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})

    res.json({success:true,message:"appointment booked"})

  }
  catch(err)
  {
    console.log(err)
    res.json({success:false,message:err.message})
  }
}


const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const appointments = await appointmentModel.find({ userId });
    const docData=doctorModel.findById(appointments.docId)
    res.json({ success: true, appointments });
  } catch (err) {
    console.error("Error in listAppointment:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};


const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId, userId } = req.body;

    if (!appointmentId || !userId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointment.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to cancel this appointment" });
    }

    const doctor = await doctorModel.findById(appointment.docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    let slots_booked = doctor.slots_booked;
    const { slotDate, slotTime } = appointment;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(time => time !== slotTime);
    }

    await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked });

    appointment.cancelled =true;
    await appointment.save();
    console.log('appointment canceled')

    res.json({ success: true, message: "Appointment canceled successfully" });
  } catch (err) {
    console.error("Error in cancelAppointment:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};





export { RegisterUser, LoginUser, getUserData, updateProfile,bookAppointment,listAppointment ,cancelAppointment};
