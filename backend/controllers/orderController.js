const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Restaurant = require("../models/Restaurant");

const placeOrder = async (req, res) => {
  try {
    const { restaurantId } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
      restaurant: restaurantId,
    });

    if (!cart || cart.items.length === 0) {
      return res.send({
        success: false,
        message: "Cart is empty",
      });
    }

    //creating the order
    const order = await Order.create({
      user: req.user._id,
      restaurant: cart.restaurant,
      items: cart.items,
      totalPrice: cart.totalPrice,
    });

    //clear cart
    await Cart.findByIdAndDelete(cart._id);

    res.send({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const orders = await Order.find({
      user: req.user._id,
      restaurant: restaurantId,
    })
      .populate("items.food")
      .populate("restaurant", "name");

    if (orders.length === 0) {
      return res.send({
        success: false,
        message: "No orders found",
      });
    }

    res.send({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.send({
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
      return res.send({
        success: false,
        message: "Order not found",
      });
    }
    //owner authorization
    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.send({
        success: false,
        message: "You are not allowed to update this order",
      });
    }
    order.status = status;
    await order.save();

    res.send({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { placeOrder, getOrders, updateOrderStatus };
