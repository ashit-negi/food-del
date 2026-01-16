const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");

//adding food
const addFood = async (req, res) => {
  try {
    const { name, description, price, category, image, restaurant } = req.body;

    const hotel = await Restaurant.findById(restaurant);
    if (!hotel) {
      return res.send({
        success: false,
        message: "Restaurant not found",
      });
    }
    if (hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        success: false,
        message: "You are not allowed to add food to this restaurant",
      });
    }
    const food = await Food.create({
      name,
      description,
      price,
      category,
      image,
      restaurant,
    });

    return res.send({
      success: true,
      message: "Food added successfully",
      food,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

const getFoodByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const hotel = await Restaurant.findById(restaurantId);
    if (!hotel) {
      return res.send({
        success: false,
        message: "Restaurant not found",
      });
    }
    const foods = await Food.find({ restaurant: restaurantId }).populate(
      "restaurant",
      "name address"
    );

    res.send({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

//update update
const updateFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findById(foodId);
    if (!food) {
      return res.send({
        success: false,
        message: "Food not found",
      });
    }

    const restaurant = await Restaurant.findById(food.restaurant);

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        success: false,
        message: "You are not allowed to update this food",
      });
    }

    await Food.findByIdAndUpdate(foodId, req.body);

    res.send({
      success: true,
      message: "Food updated successfully!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// delete food
const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findById(foodId);
    if (!food) {
      return res.send({
        success: false,
        message: "Food not found",
      });
    }

    const restaurant = await Restaurant.findById(food.restaurant);

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        success: false,
        message: "You are not allowed to delete this food",
      });
    }

    await Food.findByIdAndDelete(foodId);

    res.send({
      success: true,
      message: "Food is Deleted!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { addFood, getFoodByRestaurant, updateFood, deleteFood };
