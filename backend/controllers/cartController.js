const Cart = require("../models/Cart");
const Food = require("../models/Food");

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

    cart.items.push({
      food: foodId,
      quantity: quantity || 1,
    });

    cart.totalPrice += food.price * (quantity || 1);

    await cart.save();

    res.send({
      success: true,
      message: "Food added to cart",
      cart,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
      restaurant: restaurantId,
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
      succss: false,
      message: error.message,
    });
  }
};

// to update the cart
const updateCart = async (req, res) => {
  try {
    const { restaurantId, foodId, quantity } = req.params;

    const cart = await Cart.findOneAndUpdate({
      user: req.user._id,
      restaurant: restaurantId,
    });

    if (!cart) {
      return res.send({
        success: false,
        message: "Cart not found",
      });
    }

    //to find the food item inside the cart
    const item = cart.items.find((i) => i.food.toString() === foodId);

    if (!item) {
      return res.send({
        success: false,
        message: "Food not found in cart",
      });
    }
    //to get the food price
    const food = await Food.findById(foodId);

    //remove old price
    cart.totalPrice -= item.quantity * food.price;

    //update quantity
    item.quantity = quantity;

    //new price
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

// remove items from the cart
const removeItemFromCart = async (req, res) => {
  try {
    const { restaurantId, foodId } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
      restaurant: restaurantId,
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

    // remove price
    cart.totalPrice -= cart.items[itemIndex].quantity * food.price;

    //remove item
    cart.items.splice(itemIndex, 1);

    //cart item...... delete it
    if (cart.items.length === 0) {
      await Cart.findOneAndDelete(cart._id);
      return res.send({
        success: true,
        message: "Cart cleared",
      });
    }
    await cart.save();

    res.send({
      success: true,
      message: "Item removed from the cart",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { addToCart, getCart, updateCart, removeItemFromCart };
