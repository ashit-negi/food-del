const express = require("express");
const {
  createRestaurant,
  getAllRestaurants,
  getSingleRestaurant,
} = require("../controllers/restaurantController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
// this is for protected route
router.post("/", protect, createRestaurant);
//this one is public route
router.get("/", getAllRestaurants);
router.get("/:id", getSingleRestaurant);

module.exports = router;
