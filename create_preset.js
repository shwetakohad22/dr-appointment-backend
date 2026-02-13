const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "doctor-appointment",
  api_key: process.env.CLOUDINARY_API_KEY || "332865282386124",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "9oLbfWtRZxHiLdDB2D8GWMKQ1XA",
});

const createPreset = async () => {
  try {
    const result = await cloudinary.api.create_upload_preset({
      name: "doctor_preset",
      unsigned: true,
      folder: "doctor-appointments",
    });
    console.log("Preset Created:", result);
  } catch (error) {
    if (
      error.error &&
      error.error.message &&
      error.error.message.includes("already exists")
    ) {
      console.log("Preset 'doctor_preset' already exists. Using it.");
    } else {
      console.error("Error creating preset:", error);
    }
  }
};

createPreset();
