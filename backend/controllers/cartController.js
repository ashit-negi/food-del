const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Food = require("../models/Food");

// =======================
// ADD TO CART
// =======================
const addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    const food = await Food.findById(foodId);
    if (!food) {
      return res.send({
        success: false,
        message: "Food not found",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
      restaurant: food.restaurant,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        restaurant: food.restaurant,
        items: [],
        totalPrice: 0,
      });
    }

    // 🔥 CHECK IF FOOD ALREADY EXISTS
    const existingItem = cart.items.find(
      (item) => item.food.toString() === foodId,
    );

    if (existingItem) {
      // ✅ increase quantity
      existingItem.quantity += quantity || 1;
    } else {
      // ✅ add new item
      cart.items.push({
        food: foodId,
        quantity: quantity || 1,
      });
    }

    // 🔥 RECALCULATE TOTAL PRICE
    cart.totalPrice = 0;
    for (let item of cart.items) {
      const itemFood = await Food.findById(item.food);
      cart.totalPrice += itemFood.price * item.quantity;
    }

    await cart.save();

    res.send({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET CART  ✅ FIXED
// =======================
const getCart = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
      restaurant: new mongoose.Types.ObjectId(restaurantId),
    }).populate("items.food");

    if (!cart) {
      return res.send({
        success: false,
        message: "Cart is empty",
      });
    }

    res.send({
      success: true,
      cart,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// UPDATE CART
// =======================
const updateCart = async (req, res) => {
  try {
    const { restaurantId, foodId, quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
      restaurant: new mongoose.Types.ObjectId(restaurantId),
    });

    if (!cart) {
      return res.send({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find((i) => i.food.toString() === foodId);

    if (!item) {
      return res.send({
        success: false,
        message: "Food not found in cart",
      });
    }

    const food = await Food.findById(foodId);

    // remove old price
    cart.totalPrice -= item.quantity * food.price;

    // update quantity
    item.quantity = quantity;

    // add new price
    cart.totalPrice += quantity * food.price;

    await cart.save();

    res.send({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// REMOVE ITEM FROM CART
// =======================
const removeItemFromCart = async (req, res) => {
  try {
    const { restaurantId, foodId } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
      restaurant: new mongoose.Types.ObjectId(restaurantId),
    });

    if (!cart) {
      return res.send({
        success: false,
        message: "Cart not found",
      });
    }

    const food = await Food.findById(foodId);

    const itemIndex = cart.items.findIndex((i) => i.food.toString() === foodId);

    if (itemIndex === -1) {
      return res.send({
        success: false,
        message: "Food not found in cart",
      });
    }

    cart.totalPrice -= cart.items[itemIndex].quantity * food.price;

    cart.items.splice(itemIndex, 1);

    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.send({
        success: true,
        message: "Cart cleared",
      });
    }

    await cart.save();

    res.send({
      success: true,
      message: "Item removed from the cart",
      cart,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeItemFromCart,
};
