const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDb = require("./dbConnect/dbConnect");
const UserRouter = require("./routes/UserRoute");
const AdminRouter = require("./routes/AdminRoute");
dotenv.config();
const cors = require("cors");
const doctorRouter = require("./routes/DoctorRoute");
const path = require("path");

app.use(express.json());

app.use(cors());
connectDb();

app.use("/api/user", UserRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/doctor", doctorRouter);
const port = process.env.PORT || 8001;

if (process.env.NODE_ENV === "production") {
  app.use("/".express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}
app.listen(port, () => {
  console.log(`server is running on PORT ${port}`);
});
