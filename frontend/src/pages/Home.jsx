import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import "./Home.css";
import RestaurantCard from "../components/RestaurantCard";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await API.get("/restaurants");
        setRestaurants(res.data.restaurants || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <>
      <Navbar />

      <div className="home-container">
        {/* 🔥 HERO SECTION */}
        <div className="home-hero">
          <h1 className="home-title">
            Welcome, <span>{user?.name}</span> 👋
          </h1>
          <p className="home-subtitle">
            Discover restaurants and order your favourite food
          </p>
        </div>

        {/* 🔹 CONTENT */}
        {loading ? (
          <p className="loading-text">Loading restaurants...</p>
        ) : restaurants.length === 0 ? (
          <p className="empty-text">No restaurants available</p>
        ) : (
          <div className="restaurant-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
