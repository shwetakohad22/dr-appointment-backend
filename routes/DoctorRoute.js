const express = require("express");
const {
  getDoctorInfo,
  updateDoctorProfile,
  getDoctorId,
  getAppointmentsByDoctorId,
  changeAppointmentStatus,
} = require("../controller/doctor.Controller");
const doctorRouter = express.Router();

doctorRouter.post("/get-doctor-info-by-id", getDoctorInfo);
doctorRouter.post("/get-doctor-id", getDoctorId);
doctorRouter.post("/update-doctor-profile", updateDoctorProfile);
doctorRouter.get("/get-appointments-by-doctor-id", getAppointmentsByDoctorId);
doctorRouter.post("/change-appointment-status", changeAppointmentStatus);

module.exports = doctorRouter;
