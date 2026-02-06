const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// 🔥 get logged-in user profile
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id).select("name email address");
  res.json({ success: true, user });
});

module.exports = router;
