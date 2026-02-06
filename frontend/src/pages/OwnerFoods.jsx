import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import "./OwnerFoods.css";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
};

const OwnerFoods = () => {
  const { restaurantId } = useParams();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchFoods = async () => {
    try {
      const res = await API.get(`/food/restaurant/${restaurantId}`);
      if (res.data.success) setFoods(res.data.foods);
      else setFoods([]);
    } catch (e) {
      console.error(e);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [restaurantId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.post("/food/add", {
        ...form,
        price: Number(form.price),
        restaurant: restaurantId,
      });
      setForm(emptyForm);
      fetchFoods();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (food) => {
    setEditingId(food._id);
    setForm({
      name: food.name,
      description: food.description || "",
      price: food.price,
      category: food.category,
      image: food.image || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await API.post(`/food/update/${editingId}`, {
        ...form,
        price: Number(form.price),
      });
      setEditingId(null);
      setForm(emptyForm);
      fetchFoods();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (foodId) => {
    if (!window.confirm("Delete this food?")) return;
    try {
      await API.delete(`/food/delete/${foodId}`);
      fetchFoods();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <p>Loading foods...</p>;

  return (
    <>
      <Navbar />

      <div className="owner-foods">
        <h1>Manage Foods</h1>

        {/* FORM */}
        <form
          className="food-form"
          onSubmit={editingId ? handleUpdate : handleAdd}
        >
          <h3>{editingId ? "Update Food" : "Add Food"}</h3>

          <input
            name="name"
            placeholder="Food name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
          <input
            name="image"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button disabled={submitting}>
              {editingId ? "Update" : "Add"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* LIST */}
        <div className="food-list">
          {foods.length === 0 ? (
            <p>No food items</p>
          ) : (
            foods.map((food) => (
              <div className="food-row" key={food._id}>
                <div className="food-info">
                  <strong>{food.name}</strong>
                  <p>₹ {food.price}</p>
                  <small>{food.category}</small>
                </div>

                <div className="row-actions">
                  <button onClick={() => startEdit(food)}>Edit</button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(food._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OwnerFoods;
