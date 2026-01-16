const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

module.exports = router;

//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NWNlZGJhZTRlNDkxOGQ1Y2UyMDEwZCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc2NzY5OTcwNiwiZXhwIjoxNzY4MzA0NTA2fQ.G-s-UQwx0exS4k90mVf0Y5HNEbXiW4ogZRr8RHxw9mY",
//
