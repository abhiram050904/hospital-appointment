import express from 'express'
import { addDoctor, LoginAdmin } from '../controllers/Admincontroller.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/AuthAdmin.js'

const adminRouter=express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',LoginAdmin)

export default adminRouter

