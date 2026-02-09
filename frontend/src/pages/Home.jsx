import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import image1 from "../assets/delivery.png";
import image2 from "../assets/restaurant.png";
import image3 from "../assets/payment.png";
import contact from "../assets/contact.png";
import Navbar from "../components/Navbar";
import LandingNavbar from "../components/LandingNavbar";
import RestaurantCard from "../components/RestaurantCard";

import API from "../api/axios";
import "./Home.css";
import chefImg from "../assets/chefPhot.png";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 fetch restaurants ONLY if logged in
  useEffect(() => {
    if (!user) return;

    const fetchRestaurants = async () => {
      try {
        const res = await API.get("/restaurants");
        setRestaurants(res.data.restaurants || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [user]);

  // ================= LOGGED OUT → LANDING PAGE =================
  if (!user) {
    return (
      <>
        <LandingNavbar />

        {/* ========== HERO / LANDING ========== */}
        <section id="home" className="landing">
          <div className="landing-left">
            <h1>
              Order Food <span>Anytime</span>, Anywhere 🍔
            </h1>

            <p>
              Discover local restaurants, add your favourite food to cart and
              get it delivered hot & fresh at your doorstep.
            </p>

            <div className="landing-actions">
              <button onClick={() => navigate("/login")}>Order Now</button>
              <button className="outline" onClick={() => navigate("/register")}>
                Get Started
              </button>
            </div>

            <div className="social-icons">
              <a className="icon instagram">
                <FaInstagram />
              </a>
              <a className="icon facebook">
                <FaFacebookF />
              </a>
            </div>
          </div>

          <div className="landing-right">
            <div className="chef-blob">
              <img src={chefImg} alt="Chef illustration" />
            </div>
          </div>
        </section>

        {/* ========== ABOUT SECTION ========== */}
        <section id="about" className="about-section">
          <div className="about-content">
            <h2>About Foodify</h2>
            <p className="about-subtitle">
              Delivering happiness, one meal at a time 🍔
            </p>

            <p>
              Foodify is a modern food delivery platform that helps users
              discover nearby restaurants and order food easily.
            </p>

            <p>
              With secure online payments and smooth order management, Foodify
              ensures a great experience for both customers and restaurant
              owners.
            </p>

            <div className="about-features">
              <div>
                <img src={image1} alt="Fast delivery" />
                <p>Fast & Reliable Delivery</p>
              </div>

              <div>
                <img src={image2} alt="Verified restaurants" />
                <p>Verified Restaurants</p>
              </div>

              <div>
                <img src={image3} alt="Secure payments" />
                <p>Secure Online Payments</p>
              </div>
            </div>
          </div>
        </section>
        {/* ========== CONTACT SECTION ========== */}
        <section id="contact" className="contact-section">
          <div className="contact-wrapper">
            {/* LEFT : IMAGE */}
            <div className="contact-image">
              <img src={contact} alt="Customer support" />
            </div>

            {/* RIGHT : DETAILS */}
            <div className="contact-details">
              <h2>Contact Us</h2>
              <p>Have questions or need help? Reach out to us anytime.</p>

              <div className="contact-info">
                <p>
                  📧 <strong>Email:</strong> support@foodify.com
                </p>
                <p>
                  📞 <strong>Phone:</strong> +91 98765 43210
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // ================= LOGGED IN → RESTAURANTS =================
  return (
    <>
      <Navbar />

      <div className="home-container">
        <div className="home-hero">
          <h1 className="home-title">
            Welcome, <span>{user.name}</span> 👋
          </h1>
          <p className="home-subtitle">
            Choose your favourite restaurant and start ordering
          </p>
        </div>

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
