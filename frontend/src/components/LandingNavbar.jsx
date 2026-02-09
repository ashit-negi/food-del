import { useNavigate } from "react-router-dom";
import "./LandingNavbar.css";

const LandingNavbar = () => {
  const navigate = useNavigate();

  // 🔹 ADD THIS FUNCTION
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar landing-navbar">
      <h2 className="navbar-logo" onClick={() => scrollToSection("home")}>
        Foodify 🍔
      </h2>

      <div className="navbar-right">
        <button className="home-btn" onClick={() => scrollToSection("home")}>
          Home
        </button>
        <button className="home-btn" onClick={() => scrollToSection("about")}>
          About
        </button>

        <button className="home-btn" onClick={() => scrollToSection("contact")}>
          Contact
        </button>

        <button
          className="navbar-btn outline"
          onClick={() => navigate("/login")}
        >
          Sign in
        </button>
      </div>
    </nav>
  );
};

export default LandingNavbar;
