const express = require("express");
const {
  createRestaurant,
  getAllRestaurants,
  getSingleRestaurant,
  getMyRestaurants,
} = require("../controllers/restaurantController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ============================
// CREATE RESTAURANT (rOwner)
// ============================
router.post("/", protect, createRestaurant);

// ============================
// GET ALL RESTAURANTS (PUBLIC)
// ============================
router.get("/", getAllRestaurants);

// ============================
// 🔥 GET ALL RESTAURANTS OF LOGGED-IN OWNER
// ============================
router.get("/my/restaurants", protect, getMyRestaurants);

// ============================
// GET SINGLE RESTAURANT
// ============================
router.get("/:id", getSingleRestaurant);

module.exports = router;
