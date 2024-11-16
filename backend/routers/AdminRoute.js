import express from 'express'
import { addDoctor, allDoctors, LoginAdmin,changeAvailability, appointmentAdmin, cancelAppointment, adminDashboard } from '../controllers/Admincontroller.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/AuthAdmin.js'

const adminRouter=express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',LoginAdmin)
adminRouter.get('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/all-appointments',authAdmin,appointmentAdmin)
adminRouter.post('/delete-appointment',authAdmin,cancelAppointment)
adminRouter.get('/all-data',authAdmin,adminDashboard)
export default adminRouter

