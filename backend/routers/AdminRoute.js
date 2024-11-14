import express from 'express'
import { addDoctor, allDoctors, LoginAdmin } from '../controllers/Admincontroller.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/AuthAdmin.js'

const adminRouter=express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',LoginAdmin)
adminRouter.get('/all-doctors',authAdmin,allDoctors)

export default adminRouter

