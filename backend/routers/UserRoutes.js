import express from 'express'
import { RegisterUser,LoginUser } from '../controllers/UserController.js'


const userRouter=express.Router()

userRouter.post('/register',RegisterUser)
userRouter.post('/login',LoginUser)


export default userRouter
