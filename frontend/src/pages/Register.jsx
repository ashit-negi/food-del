import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ ADD
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", formData);

      // ✅ SUCCESS TOAST
      toast.success(res.data.message || "Registered successfully");

      login(res.data.user, res.data.token);
      navigate("/");
    } catch (error) {
      // ✅ ERROR TOAST
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container register">
      {/* LEFT TEXT */}
      <div className="auth-left">
        <h1>Start your</h1>
        <h2>food journey</h2>
        <p>
          Create an account to discover nearby restaurants, order your favourite
          meals and enjoy fast delivery.
        </p>
      </div>

      {/* FORM */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <h3>Create account</h3>

        <input
          name="name"
          placeholder="Full name"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email address"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>

        <p>
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
