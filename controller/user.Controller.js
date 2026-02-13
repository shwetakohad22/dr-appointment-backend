const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");
const appointmentModel = require("../models/AppointmentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: "1d",
      },
    );
    res
      .status(200)
      .json({ message: "User registered successfully", success: true, token });
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
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: "1d",
      },
    );
    return res
      .status(200)
      .json({ message: "Login successful", success: true, token, user });
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
    const image = req.file ? req.file.path : "";
    const newDoctor = new doctorModel({
      ...req.body,
      image,
      status: "pending",
    });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });

    if (adminUser) {
      const unseenNotifications = adminUser.unseenNotifications;
      unseenNotifications.push({
        type: "new-doctor-request",
        message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
        data: {
          doctorId: newDoctor._id,
          name: newDoctor.firstName + " " + newDoctor.lastName,
          onClickPath: "/admin/doctors",
        },
      });
      await userModel.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    }

    res.status(200).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log("Error in applyDoctor:", error);
    res.status(500).send({
      message: "Error Applying Doctor account",
      success: false,
      error: error.message || error,
    });
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

    // Fetch the user who is booking the appointment
    console.log("Booking Appointment: userId from request:", userId);
    const bookingUser = await userModel.findById(userId);
    console.log("Booking Appointment: found bookingUser:", bookingUser);

    const user = await userModel.findOne({ _id: doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new Appointment Request from ${bookingUser ? bookingUser.name : "User"}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
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

const markAllNotificationsAsSeen = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const unseenNotifications = user.unseenNotifications;
    const seenNotifications = user.seenNotifications;

    // Create new array to ensure Mongoose detects change
    user.seenNotifications = [...seenNotifications, ...unseenNotifications];
    user.unseenNotifications = [];

    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error marking notifications as seen",
      success: false,
      error,
    });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications deleted successfully",
      data: updatedUser,
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

const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
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
  markAllNotificationsAsSeen,
  deleteAllNotifications,
  updateUserProfile,
};
