import express from 'express'

import { allDoctors, appointmentComplete, appointmentsDoctor, cancelAppointment, DoctorDashboard, editDoctorProfile, getDoctorProfile, loginDoctor } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/AuthDoctor.js'


const doctorRouter=express.Router()


doctorRouter.get('/list',allDoctors)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/all-appointments',authDoctor,appointmentsDoctor)
doctorRouter.post('/delete-appointment',authDoctor,cancelAppointment);
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.get('/doctor-dashboard',authDoctor,DoctorDashboard)
doctorRouter.get('/get-profile',authDoctor,getDoctorProfile)
doctorRouter.post('/edit-profile',authDoctor,editDoctorProfile)
export default doctorRouter