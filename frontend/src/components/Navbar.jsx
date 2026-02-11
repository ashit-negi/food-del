import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="navbar">
      <h2 className="navbar-logo" onClick={() => navigate("/")}>
        Foodify 🍔
      </h2>

      {/* 🍔 Hamburger (mobile only) */}
      <button
        type="button"
        className="hamburger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div className={`navbar-right ${open ? "open" : ""}`}>
        <button className="home-btn" onClick={() => navigate("/")}>
          Home 🏠
        </button>

        <button
          className="cart-btn"
          onClick={() => {
            if (!cart || cart.items.length === 0) {
              alert("Your cart is empty 🛒");
              return;
            }
            navigate(`/cart/${cart.restaurant}`);
          }}
        >
          Cart 🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        <button className="cart-btn" onClick={() => navigate("/orders")}>
          My Orders 📦
        </button>

        {user?.role === "rOwner" && (
          <button
            className="cart-btn"
            onClick={() => navigate("/owner/restaurants")}
          >
            My Restaurant 🏪
          </button>
        )}

        <button className="navbar-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
