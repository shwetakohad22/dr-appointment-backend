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
} = require("../controller/user.Controller");
const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.get("/userRole/:userId", getUserRole);
UserRouter.post("/apply-doctor-account", applyDoctor);
UserRouter.get("/get-all-approved-doctors", getAllApprovedDoctors);
UserRouter.post("/book-appointment", bookAppointment);
UserRouter.get("/get-appointments-by-user-id", getAppointmentsByUserId);
UserRouter.get("/get-user-by-id", getDetailsByUserID);

module.exports = UserRouter;
