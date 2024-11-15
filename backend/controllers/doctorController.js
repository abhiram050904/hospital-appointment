import doctorModel from "../models/doctorModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { doctId } = req.body;
    console.log(doctId);

    const doctData = await doctorModel.findById(doctId);
    console.log(doctData);
    await doctorModel.findByIdAndUpdate(doctId, {
      available: !doctData.available,
    });
    res.json({ success: true, message: `Availability changed` });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password,-email");
    res.json({ success: true, doctors });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export { changeAvailability,allDoctors};
