import React from "react";
import "./Restaurant.css";
import { useNavigate } from "react-router-dom";

export const RestaurantCard = ({ restaurant }) => {
  console.log(restaurant);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${restaurant._id}`);
  };
  return (
    <div className="restaurant-card" onClick={handleClick}>
      <div className="restaurant-image-wrapper">
        <img
          src={restaurant.image || "https://via.placeholder.com/400x250"}
          alt={restaurant.name}
          className="restaurant-image"
        />
      </div>

      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p className="restaurant-address">
          {restaurant.address || "Location not available"}
        </p>
      </div>

      <div className="restaurant-footer">
        <span className="rating">⭐ {restaurant.rating || 4.0}</span>
      </div>
    </div>
  );
};

export default RestaurantCard;
