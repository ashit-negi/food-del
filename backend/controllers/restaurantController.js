const Restaurant = require("../models/Restaurant");

// ============================
// CREATE RESTAURANT (rOwner)
// ============================
const createRestaurant = async (req, res) => {
  try {
    const { name, address, image } = req.body;

    if (!name || !address) {
      return res.status(400).json({
        success: false,
        message: "Please provide name and address",
      });
    }

    if (req.user.role !== "rOwner") {
      return res.status(403).json({
        success: false,
        message: "Only restaurant owners can create a restaurant",
      });
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      image,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET ALL RESTAURANTS (PUBLIC)
// ============================
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("owner", "name email");

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET SINGLE RESTAURANT
// ============================
const getSingleRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id).populate(
      "owner",
      "name email",
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.json({
      success: true,
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// 🔥 GET LOGGED-IN OWNER'S ALL RESTAURANTS
// ============================
const getMyRestaurants = async (req, res) => {
  try {
    if (req.user.role !== "rOwner") {
      return res.status(403).json({
        success: false,
        message: "Only restaurant owners allowed",
      });
    }

    const restaurants = await Restaurant.find({
      owner: req.user._id,
    });

    res.json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getSingleRestaurant,
  getMyRestaurants,
};
