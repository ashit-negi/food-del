import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
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
      const res = await API.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="auth-container login">
      {/* LEFT TEXT */}
      <div className="auth-left">
        <h1>Good food</h1>
        <h2>delivered to you</h2>
        <p>
          Order from nearby restaurants, enjoy fast delivery and secure payments
          — all in one place.
        </p>
      </div>

      {/* RIGHT FORM */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <h3>Welcome back</h3>

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

        <button type="submit">Login</button>

        <p>
          New here?{" "}
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
