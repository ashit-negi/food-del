import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/order/my");
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <>
      <Navbar />

      <div className="order-history">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* HEADER */}
              <div className="order-header">
                <span>Order #{order._id.slice(-6)}</span>
                <span className={`status ${order.status}`}>{order.status}</span>
              </div>

              {/* RESTAURANT */}
              <p className="restaurant-name">
                Restaurant: <strong>{order.restaurant?.name}</strong>
              </p>

              {/* ITEMS */}
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.food._id} className="order-item">
                    <span>
                      {item.food.name}
                      {item.quantity && ` x${item.quantity}`}
                    </span>
                    <span>₹ {item.food.price}</span>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="order-footer">
                <strong>Total: ₹ {order.totalPrice}</strong>

                <div className="payment-info">
                  <span>
                    Payment:{" "}
                    <strong className={`payment ${order.paymentStatus}`}>
                      {order.paymentStatus || "pending"}
                    </strong>
                  </span>

                  <span>
                    Method: <strong>{order.paymentMethod || "online"}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default OrderHistory;
