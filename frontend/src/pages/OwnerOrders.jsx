import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import "./OwnerOrders.css";

const OwnerOrders = () => {
  const { restaurantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await API.get(`/order/${restaurantId}`);
      if (res.data.success) setOrders(res.data.orders);
      else setOrders([]);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [restaurantId]);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await API.put("/order/status", { orderId, status });
      fetchOrders();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <>
      <Navbar />

      <div className="owner-orders">
        <h1>Restaurant Orders</h1>

        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="owner-order-card">
              <div className="owner-order-header">
                <span>Order #{order._id.slice(-6)}</span>
                <div>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                  <span className="payment-badge">
                    {order.paymentStatus === "paid" ? "PAID 💳" : "UNPAID"}
                  </span>
                </div>
              </div>

              {/* ITEMS */}
              <div className="owner-order-items">
                {order.items.map((item) => (
                  <div key={item.food._id} className="owner-order-item">
                    <span>
                      {item.food.name}
                      {item.quantity && ` x${item.quantity}`}
                    </span>
                    <span>₹ {item.food.price}</span>
                  </div>
                ))}
              </div>

              {/* 📍 DELIVERY ADDRESS */}
              <div className="address-card">
                <strong>Delivery Address</strong>
                <p>
                  {order.deliveryAddress.name} ({order.deliveryAddress.phone})
                  <br />
                  {order.deliveryAddress.house}, {order.deliveryAddress.area}
                  <br />
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.pincode}
                  {order.deliveryAddress.landmark &&
                    `, ${order.deliveryAddress.landmark}`}
                </p>
              </div>

              {/* FOOTER */}
              <div className="owner-order-footer">
                <strong>Total: ₹ {order.totalPrice}</strong>

                {order.status === "pending" && (
                  <div className="status-actions">
                    <button
                      onClick={() => updateStatus(order._id, "completed")}
                    >
                      Complete
                    </button>
                    <button
                      className="cancel"
                      onClick={() => updateStatus(order._id, "cancelled")}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default OwnerOrders;
