const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    house: { type: String },
    area: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    landmark: { type: String },
  },
  { _id: false },
);

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

    // ✅ FIXED: address as OBJECT
    address: {
      type: addressSchema,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
