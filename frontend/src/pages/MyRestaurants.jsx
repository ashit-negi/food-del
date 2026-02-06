import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import RestaurantOwnerDashboard from "./RestaurantOwnerDashboard";
import "./MyRestaurants.css";

const MyRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyRestaurants = async () => {
    try {
      const res = await API.get("/restaurants/my/restaurants");
      if (res.data.success) {
        setRestaurants(res.data.restaurants);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRestaurants();
  }, []);

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="my-restaurants">
        <div className="header">
          <h1>My Restaurants</h1>

          <button className="create-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "+ Create Restaurant"}
          </button>
        </div>

        {/* CREATE RESTAURANT FORM */}
        {showForm && (
          <RestaurantOwnerDashboard
            onSuccess={() => {
              setShowForm(false);
              fetchMyRestaurants();
            }}
          />
        )}

        {/* RESTAURANT LIST */}
        {!showForm && restaurants.length === 0 && (
          <p className="empty-text">No restaurants created yet.</p>
        )}

        {!showForm && (
          <div className="restaurant-list">
            {restaurants.map((res) => (
              <div className="restaurant-card" key={res._id}>
                <h3>{res.name}</h3>
                <p>{res.address}</p>

                <div className="card-actions">
                  <button onClick={() => navigate(`/owner/foods/${res._id}`)}>
                    Manage Foods 🍽️
                  </button>

                  <button onClick={() => navigate(`/owner/orders/${res._id}`)}>
                    View Orders 📦
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyRestaurants;
