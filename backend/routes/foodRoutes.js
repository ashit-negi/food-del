const express = require("express");
const {
  addFood,
  getFoodByRestaurant,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addFood);
//get food from the restaurant
router.get("/restaurant/:restaurantId", getFoodByRestaurant);

//ud operations
router.post("/update/:foodId", protect, updateFood);
router.delete("/delete/:foodId", protect, deleteFood);

module.exports = router;
