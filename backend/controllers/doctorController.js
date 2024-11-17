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


const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required" });
    }

  
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    
    if (appointment.cancelled) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot complete a canceled appointment" });
    }

   
    appointment.isCompleted = true;
    await appointment.save();

    res.json({ success: true, message: "Appointment marked as completed" });
  } catch (err) {
    console.error("Error in appointmentComplete:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error, please try again" });
  }
};


const DoctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];
    appointments.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse(),
    };

    res.json({ success: true, dashData });

  } catch (err) {
    console.error("Error in DoctorDashboard:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    // Find the doctor by their ID
    const doctor = await doctorModel.findById(docId).select("-password -email");

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({
      success: true,
      doctor,
    });
  } catch (err) {
    console.error("Error in getDoctorProfile:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};

const editDoctorProfile = async (req, res) => {
  try {
    const { docId, name, specialization, contact, bio } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    // Validate the required fields
    if (!name && !specialization && !contact && !bio) {
      return res.status(400).json({ success: false, message: "At least one field to update is required" });
    }

    // Find the doctor by their ID
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Update the doctor profile fields
    if (name) doctor.name = name;
    if (specialization) doctor.specialization = specialization;
    if (contact) doctor.contact = contact;
    if (bio) doctor.bio = bio;

    // Save the updated doctor data
    await doctor.save();

    res.json({
      success: true,
      message: "Doctor profile updated successfully",
      doctor,
    });
  } catch (err) {
    console.error("Error in editDoctorProfile:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};


export { changeAvailability, allDoctors, loginDoctor, appointmentsDoctor,cancelAppointment,appointmentComplete,DoctorDashboard,getDoctorProfile,editDoctorProfile};
