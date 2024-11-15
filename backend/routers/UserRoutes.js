import express from 'express'
import { RegisterUser,LoginUser, getUserData, updateProfile } from '../controllers/UserController.js'
import authUser from '../middlewares/AuthUser.js'
import upload from '../middlewares/multer.js'


const userRouter=express.Router()

userRouter.post('/register',RegisterUser)
userRouter.post('/login',LoginUser)
userRouter.get('/get-profile',authUser,getUserData)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)


export default userRouter
