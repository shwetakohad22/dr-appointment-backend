const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error Applying doctor account",
      success: false,
      error,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error Applying doctor account",
      success: false,
      error,
    });
  }
};

const changeDoctorStatus = async (req, res) => {
  const { doctorId, status } = req.body;
  try {
    const updatedDoctor = await doctorModel.findByIdAndUpdate(doctorId, {
      status,
    });
  
    const user = await userModel.findOne({ _id: updatedDoctor.userId });

    user.isDoctor = status.toLowerCase() === "approved";

    await user.save();

    res.status(200).json({
      success: true,
      message: `Doctor status updated successfully`,
      data: updatedDoctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
};


module.exports = { getAllDoctors, getAllUsers, changeDoctorStatus };
