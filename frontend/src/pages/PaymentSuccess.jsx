import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  // auto redirect after 3 sec
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="payment-success">
      <div className="success-card">
        <div className="check">✔</div>
        <h1>Payment Successful</h1>
        <p>Your order has been placed successfully.</p>

        <button onClick={() => navigate("/orders")}>View My Orders</button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
