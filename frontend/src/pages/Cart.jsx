import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate(); // ✅ navigate init

  const { cart, loading, fetchCart, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    if (restaurantId) {
      fetchCart(restaurantId);
    }
  }, [restaurantId]);

  return (
    <>
      <Navbar />

      <div className="cart">
        <h1>Your Cart</h1>

        {/* 🔄 LOADING */}
        {loading && <p>Loading cart...</p>}

        {/* ❌ EMPTY */}
        {!loading && !cart && <p>Cart is empty</p>}

        {/* ✅ CART DATA */}
        {!loading && cart && (
          <>
            {cart.items.map((item) => (
              <div className="cart-item" key={item.food._id}>
                <div>
                  <h4>{item.food.name}</h4>
                  <p>₹ {item.food.price}</p>
                </div>

                <div className="qty">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        cart.restaurant,
                        item.food._id,
                        Math.max(1, item.quantity - 1),
                      )
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        cart.restaurant,
                        item.food._id,
                        item.quantity + 1,
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="remove"
                  onClick={() => removeItem(cart.restaurant, item.food._id)}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="cart-footer">
              <h3>Total: ₹ {cart.totalPrice}</h3>

              <button
                type="button"
                onClick={() =>
                  navigate(`/checkout/${cart.restaurant}`, {
                    state: { amount: cart.totalPrice },
                  })
                }
              >
                Proceed to Payment
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
