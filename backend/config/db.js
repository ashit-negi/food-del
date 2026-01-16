const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE);
    console.log("db is connected");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
