const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const axios = require("axios");

dotenv.config();

const app = express();

/* =============================
   MIDDLEWARE
============================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

/* =============================
   DATABASE CONNECTION
============================= */

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });

/* =============================
   ROUTES
============================= */

const UserRouter = require("./routes/UserRoute");
const AdminRouter = require("./routes/AdminRoute");
const DoctorRouter = require("./routes/DoctorRoute");

app.use("/api/user", UserRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/doctor", DoctorRouter);

/* =============================
   GLOBAL ERROR HANDLER
============================= */

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =============================
   HEALTH CHECK & CRON JOB
============================= */

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

cron.schedule("*/5 * * * *", async () => {
  try {
    const healthUrl = `http://localhost:${process.env.PORT || 8001}/health`;
    const response = await axios.get(healthUrl);
    console.log(`Health check success: ${response.data.message}`);
  } catch (error) {
    console.error("Health check failed:", error.message);
  }
});

/* =============================
   SERVER START
============================= */

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
