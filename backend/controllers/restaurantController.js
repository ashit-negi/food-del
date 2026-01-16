const Restaurant = require("../models/Restaurant");

// CREATE RESTAURANT
const createRestaurant = async (req, res) => {
  try {
    const { name, address, image } = req.body;

    // validation
    if (!name || !address) {
      return res.status(400).json({
        message: "Please provide name and address",
      });
    }

    // role check
    if (req.user.role !== "rOwner") {
      return res.status(403).json({
        message: "Only restaurant owners can create a restaurant",
      });
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      image,
      owner: req.user._id,
    });

    return res.status(201).json({
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    console.error("CREATE RESTAURANT ERROR ", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL RESTAURANTS
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("owner", "name email");

    return res.status(200).json({
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("GET RESTAURANTS ERROR ", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// getting single restaurant
const getSingleRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id).populate(
      "owner",
      "name email"
    );

    if (!restaurant) {
      return res.send({
        message: "Restaurant not found",
      });
    }

    return res.send({
      restaurant,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createRestaurant, getAllRestaurants, getSingleRestaurant };
