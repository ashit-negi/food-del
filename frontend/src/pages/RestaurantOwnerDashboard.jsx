import { useState } from "react";
import API from "../api/axios";
import "./RestaurantOwnerDashboard.css";

const RestaurantOwnerDashboard = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      await API.post("/restaurants", form);

      // reset form
      setForm({ name: "", address: "", image: "" });

      // 🔥 parent ko signal (form close + list refresh)
      if (onSuccess) onSuccess();
    } catch (error) {
      alert("Failed to create restaurant");
    }
  };

  return (
    <div className="owner-dashboard">
      <h2>Create Your Restaurant</h2>

      <form className="restaurant-form" onSubmit={handleCreateRestaurant}>
        <input
          name="name"
          placeholder="Restaurant Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Restaurant Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <input
          name="image"
          placeholder="Image URL (optional)"
          value={form.image}
          onChange={handleChange}
        />

        <button type="submit">Create Restaurant</button>
      </form>
    </div>
  );
};

export default RestaurantOwnerDashboard;
