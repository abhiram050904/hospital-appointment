import express from 'express'

import { allDoctors } from '../controllers/doctorController.js'


const doctorRouter=express.Router()


doctorRouter.get('/list',allDoctors)

export default doctorRouter