const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getAllUsers,
  changeDoctorStatus,
  getAllAppointments,
} = require("../controller/admin.Controller");

router.get("/get-all-doctors", getAllDoctors);
router.get("/get-all-users", getAllUsers);
router.post("/change-doctor-status", changeDoctorStatus);
router.get("/get-all-appointments", getAllAppointments);

module.exports = router;
