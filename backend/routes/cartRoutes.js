const express = require("express");
const {
  addToCart,
  getCart,
  updateCart,
  removeItemFromCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/:restaurantId", protect, getCart);
router.put("/update", protect, updateCart);
router.delete("/remove", protect, removeItemFromCart);

module.exports = router;
