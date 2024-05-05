const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected successfully");
  } catch (error) {
    console.log("database connection refused", error);
  }
};

module.exports = connectDb;
