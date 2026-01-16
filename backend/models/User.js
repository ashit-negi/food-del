const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "rOwner"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

//create user model
const User = mongoose.model("User", userSchema);
module.exports = User;
