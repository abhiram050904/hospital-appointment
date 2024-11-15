import doctorModel from "../models/doctorModel.js";


const changeAvailability=async(req,res)=>{
    try{

        const {doctId}=req.body
        console.log(doctId)

        const doctData=await doctorModel.findById(doctId)
        console.log(doctData)
         await doctorModel.findByIdAndUpdate(doctId,{available:!doctData.available})
        res.json({success:true,message:`Availability changed`})
    }
    catch(err)
    {
            console.log(err)
            res.json({success:false,message:err.message})
    }
}


export {changeAvailability}