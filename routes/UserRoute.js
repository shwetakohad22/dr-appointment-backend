const express = require("express");
const {
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
} = require("../controller/user.Controller");

const upload = require("../config/cloudinary");

const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.get("/userRole/:userId", getUserRole);

UserRouter.post("/apply-doctor-account", upload.single("image"), applyDoctor);

UserRouter.get("/get-all-approved-doctors", getAllApprovedDoctors);
UserRouter.post("/book-appointment", bookAppointment);
UserRouter.get("/get-appointments-by-user-id", getAppointmentsByUserId);
UserRouter.get("/get-user-by-id", getDetailsByUserID);
UserRouter.post("/mark-all-notifications-as-seen", markAllNotificationsAsSeen);
UserRouter.post("/delete-all-notifications", deleteAllNotifications);
UserRouter.post("/update-profile", updateUserProfile);

module.exports = UserRouter;
