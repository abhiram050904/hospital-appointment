import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import appointmentModel from '../models/appointmentModel.js';

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }
    const doctData = await doctorModel.findById(docId);
    if (!doctData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndUpdate(docId, {
      available: !doctData.available,
    });

    res.json({ success: true, message: `Doctor's availability changed` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password,-email");
    res.json({ success: true, doctors });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const appointments = await appointmentModel.find({ docId });
    
    if (appointments.length === 0) {
      return res.status(200).json({ success: false, message: "No appointments found for this doctor" });
    }

    res.json({
      success: true,
      appointments,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export { changeAvailability, allDoctors, loginDoctor, appointmentsDoctor };
