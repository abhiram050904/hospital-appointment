import express from 'express'

import { allDoctors, appointmentsDoctor, loginDoctor } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/AuthDoctor.js'


const doctorRouter=express.Router()


doctorRouter.get('/list',allDoctors)
doctorRouter.post('/login',loginDoctor)
doctorRouter.post('/all-appointments',authDoctor,appointmentsDoctor)

export default doctorRouter