import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();

  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { placeOrder } = useCart();

  const amount = location.state?.amount;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 ADDRESS STATE
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    house: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  // ❌ direct access protection
  if (!amount) {
    return <p style={{ textAlign: "center" }}>Invalid checkout</p>;
  }

  // 🔥 AUTO-FILL ADDRESS FROM USER PROFILE
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await API.get("/user/me");
        if (res.data.user?.address) {
          setAddress(res.data.user.address);
        }
      } catch (err) {
        console.log("No saved address");
      }
    };

    fetchAddress();
  }, []);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const continueToPayment = () => {
    if (
      !address.name ||
      !address.phone ||
      !address.house ||
      !address.area ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      alert("Please fill all required address fields");
      return;
    }
    setStep(2);
  };

  const handlePay = async () => {
    if (!stripe || !elements) return;

    try {
      setLoading(true);
      setError("");

      // 1️⃣ create payment intent
      const res = await API.post("/payment/create-intent", { amount });
      const clientSecret = res.data.clientSecret;

      // 2️⃣ confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      // 3️⃣ success → place order WITH ADDRESS
      if (result.paymentIntent.status === "succeeded") {
        await placeOrder(restaurantId, address);
        navigate("/payment-success");
      }
    } catch (err) {
      setError("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="checkout-container">
        <div className="checkout-card">
          <h2>Checkout</h2>

          {step === 1 && (
            <>
              <h3>Delivery Address</h3>

              <div className="address-grid">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={address.name}
                  onChange={handleAddressChange}
                />
                <input
                  name="phone"
                  placeholder="Mobile Number"
                  value={address.phone}
                  onChange={handleAddressChange}
                />
                <input
                  name="house"
                  placeholder="Flat / House No"
                  value={address.house}
                  onChange={handleAddressChange}
                />
                <input
                  name="area"
                  placeholder="Area / Street"
                  value={address.area}
                  onChange={handleAddressChange}
                />

                <div className="address-row">
                  <input
                    name="city"
                    placeholder="City"
                    value={address.city}
                    onChange={handleAddressChange}
                  />
                  <input
                    name="state"
                    placeholder="State"
                    value={address.state}
                    onChange={handleAddressChange}
                  />
                </div>

                <input
                  name="pincode"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                />
                <input
                  name="landmark"
                  placeholder="Landmark (optional)"
                  value={address.landmark}
                  onChange={handleAddressChange}
                />
              </div>

              <button className="primary-btn" onClick={continueToPayment}>
                Continue to Payment →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h3>Pay ₹{amount}</h3>

              <div className="address-preview">
                <strong>Deliver to:</strong>
                <p>
                  {address.name}, {address.phone}
                  <br />
                  {address.house}, {address.area}
                  <br />
                  {address.city}, {address.state} - {address.pincode}
                  {address.landmark && <>, {address.landmark}</>}
                </p>
              </div>

              <div
                style={{
                  border: "1px solid #ddd",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <CardElement />
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <button
                className="primary-btn"
                onClick={handlePay}
                disabled={!stripe || loading}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Checkout;
