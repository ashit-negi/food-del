import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import { useCart } from "../context/CartContext";
import "./SingleRestaurant.css";

const SingleRestaurant = () => {
  const { id } = useParams(); // restaurantId
  const { addToCart } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ fetch restaurant
        const resRestaurant = await API.get(`/restaurants/${id}`);
        setRestaurant(resRestaurant.data.restaurant);

        // 2️⃣ fetch foods of restaurant
        const resFood = await API.get(`/food/restaurant/${id}`);
        setFoods(resFood.data.foods);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ CORRECT ADD TO CART (via CartContext)
  const handleAddToCart = async (food) => {
    try {
      await addToCart(food._id, 1, restaurant._id);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found</p>;

  return (
    <>
      <Navbar />

      <div className="single-restaurant">
        <h1>{restaurant.name}</h1>
        <p>{restaurant.address}</p>

        <h2>Menu</h2>

        <div className="food-grid">
          {foods.length === 0 ? (
            <p>No food available</p>
          ) : (
            foods.map((food) => (
              <FoodCard key={food._id} food={food} onAdd={handleAddToCart} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SingleRestaurant;
