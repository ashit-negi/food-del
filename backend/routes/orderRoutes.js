const express = require("express");
const {
  placeOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my", protect, getMyOrders);
router.post("/place", protect, placeOrder);
router.get("/:restaurantId", protect, getOrders);
router.put("/status", protect, updateOrderStatus);

module.exports = router;
