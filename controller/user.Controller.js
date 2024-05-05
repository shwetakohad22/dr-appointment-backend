const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");
const appointmentModel = require("../models/AppointmentModel");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();
    res
      .status(200)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", success: false, error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User doesn't exist", success: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect", success: false });
    }
    return res
      .status(200)
      .json({ message: "Login successful", success: true, user });
  } catch (error) {
    console.error("Error logging in:", error);
    res
      .status(500)
      .json({ message: "Error logging in", success: false, error });
  }
};

const getUserRole = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId, "name isAdmin isDoctor");
    if (!user) {
      return res
        .status(400)
        .json({ message: "User doesn't exist", success: false });
    }
    let role;
    if (user.isAdmin) {
      role = "admin";
    } else if (user.isDoctor) {
      role = "doctor";
    } else {
      role = "user";
    }
    return res.status(200).json({ role, name: user.name, success: true });
  } catch (error) {
    console.error("Error getting user role:", error);
    res
      .status(500)
      .json({ message: "Error getting user role", success: false, error });
  }
};

const applyDoctor = async (req, res) => {
  try {
    const newDoctor = new doctorModel({ ...req.body, status: "Pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    await userModel.findOneAndUpdate(
      { _id: adminUser._id },
      { isDoctor: true }
    );

    res
      .status(200)
      .json({ message: "Doctor Applied Successfully", success: true });
  } catch (error) {
    console.error("Error Applying Doctor:", error);
    res
      .status(500)
      .json({ message: "Error Applying Doctor account", success: false });
  }
};

const getAllApprovedDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Error getting doctor info:", error);
    res.status(500).json({
      success: false,
      message: "Error getting doctor info",
      error: error.message,
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { userId, doctorId, doctorInfo, userInfo, date } = req.body;
    const newAppointment = new appointmentModel({
      userId,
      doctorId,
      doctorInfo,
      userInfo,
      date,
    });
    await newAppointment.save();
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error booking appointment",
      success: false,
      error: error.message,
    });
  }
};

const getAppointmentsByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;
    const appointments = await appointmentModel.find({ userId: userId });
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

const getDetailsByUserID = async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUserRole,
  applyDoctor,
  getAllApprovedDoctors,
  bookAppointment,
  getAppointmentsByUserId,
  getDetailsByUserID,
};
