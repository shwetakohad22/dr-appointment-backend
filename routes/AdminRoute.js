const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getAllUsers,
  changeDoctorStatus,
} = require("../controller/admin.Controller");

router.get("/get-all-doctors", getAllDoctors);
router.get("/get-all-users", getAllUsers);
router.post("/change-doctor-status", changeDoctorStatus);

module.exports = router;
