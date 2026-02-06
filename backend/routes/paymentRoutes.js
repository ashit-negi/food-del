const express = require("express");
const {
  createStripePaymentIntent,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-intent", protect, createStripePaymentIntent);

module.exports = router;
