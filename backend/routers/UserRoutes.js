import express from 'express'
import { RegisterUser,LoginUser, getUserData, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay , verifyPayment} from '../controllers/UserController.js'
import authUser from '../middlewares/AuthUser.js'
import upload from '../middlewares/multer.js'


const userRouter=express.Router()

userRouter.post('/register',RegisterUser)
userRouter.post('/login',LoginUser)
userRouter.get('/get-profile',authUser,getUserData)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.post('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment', authUser,paymentRazorpay);
userRouter.post('/verify-payment',authUser, verifyPayment);
export default userRouter
