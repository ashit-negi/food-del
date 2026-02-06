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

router.get("/my", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.food")
      .populate("restaurant", "name");

    if (!cart) {
      return res.json({ success: false });
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

module.exports = router;
