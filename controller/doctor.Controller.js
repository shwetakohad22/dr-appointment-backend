const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/AppointmentModel");
const userModel = require("../models/userModel");

const getDoctorInfo = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      message: "Doctor fetch successfully ",
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting doctor info",
      success: false,
      error,
    });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    await doctorModel.findOneAndUpdate(
      {
        userId: req.body.userId,
      },
      req.body,
    );
    res
      .status(200)
      .send({ success: true, message: "Doctor Profile Updated successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error in updating profile ", success: false, error });
  }
};

const getDoctorId = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      message: "Doctor fetch successfully ",
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting doctor info",
      success: false,
      error,
    });
  }
};

const getAppointmentsByDoctorId = async (req, res) => {
  try {
    const { userId } = req.query;
    const doctor = await doctorModel.findOne({ userId });
    if (!doctor) {
      return res.status(404).send({
        message: "Doctor not found",
        success: false,
      });
    }
    const appointments = await appointmentModel.find({ doctorId: doctor._id });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      error,
    });
  }
};
const changeAppointmentStatus = async (req, res) => {
  const { appointmentId, status } = req.body;
  try {
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true },
    );
    const user = await userModel.findOne({ _id: appointment.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "appointment-status-changed",
      message: `Your appointment status has been ${status}`,
      onClickPath: "/appointments",
    });

    await user.save();
    res.status(200).json({
      success: true,
      message: `Appointment status updated successfully`,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error changing appointment status",
      success: false,
      error,
    });
  }
};

module.exports = {
  getDoctorInfo,
  updateDoctorProfile,
  getDoctorId,
  getAppointmentsByDoctorId,
  changeAppointmentStatus,
};
