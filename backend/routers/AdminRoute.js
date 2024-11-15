import express from 'express'
import { addDoctor, allDoctors, LoginAdmin,changeAvailability } from '../controllers/Admincontroller.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/AuthAdmin.js'

const adminRouter=express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',LoginAdmin)
adminRouter.get('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)

export default adminRouter

