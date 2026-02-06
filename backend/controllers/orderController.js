const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User"); // 🔥 FIX 1

/* ================= PLACE ORDER ================= */
const placeOrder = async (req, res) => {
  try {
    const { restaurantId, deliveryAddress } = req.body;

    if (!deliveryAddress || !deliveryAddress.phone) {
      return res.status(400).json({
        success: false,
        message: "Complete delivery address required",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
      restaurant: restaurantId,
    }).populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      deliveryAddress,
      paymentMethod: "card",
      paymentStatus: "paid",
    });

    // ✅ save address in user profile
    await User.findByIdAndUpdate(req.user._id, {
      address: deliveryAddress,
    });

    await Cart.findByIdAndDelete(cart._id);

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= CUSTOMER ORDER HISTORY ================= */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.food")
      .populate("restaurant", "name");

    res.set("Cache-Control", "no-store");

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= OWNER ORDERS ================= */
const getOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (
      !restaurant ||
      restaurant.owner.toString() !== req.user._id.toString()
    ) {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }

    const orders = await Order.find({ restaurant: restaurantId })
      .sort({ createdAt: -1 })
      .populate("items.food")
      .populate("user", "name email");

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.json({
        success: false,
        message: "Not allowed",
      });
    }

    order.status = status;
    await order.save();

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
};
