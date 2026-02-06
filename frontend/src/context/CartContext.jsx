import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async (restaurantId) => {
    if (!restaurantId) return;

    try {
      setLoading(true);
      const res = await API.get(`/cart/${restaurantId}`);
      if (res.data.success) setCart(res.data.cart);
      else setCart(null);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 RESTORE CART ON REFRESH
  useEffect(() => {
    const savedRestaurantId = localStorage.getItem("cartRestaurantId");
    if (savedRestaurantId) {
      fetchCart(savedRestaurantId);
    }
  }, []);

  const addToCart = async (foodId, quantity = 1, restaurantId) => {
    localStorage.setItem("cartRestaurantId", restaurantId);
    await API.post("/cart/add", { foodId, quantity });
    await fetchCart(restaurantId);
  };

  const updateQuantity = async (restaurantId, foodId, quantity) => {
    setCart((prev) => {
      if (!prev) return prev;

      const items = prev.items.map((item) =>
        item.food._id === foodId ? { ...item, quantity } : item,
      );

      const totalPrice = items.reduce(
        (sum, i) => sum + i.food.price * i.quantity,
        0,
      );

      return { ...prev, items, totalPrice };
    });

    await API.put("/cart/update", { restaurantId, foodId, quantity });
  };

  const removeItem = async (restaurantId, foodId) => {
    setCart((prev) => {
      if (!prev) return prev;

      const items = prev.items.filter((item) => item.food._id !== foodId);

      if (items.length === 0) return null;

      const totalPrice = items.reduce(
        (sum, i) => sum + i.food.price * i.quantity,
        0,
      );

      return { ...prev, items, totalPrice };
    });

    await API.delete("/cart/remove", {
      data: { restaurantId, foodId },
    });
  };

  const placeOrder = async (restaurantId, deliveryAddress) => {
    await API.post("/order/place", {
      restaurantId,
      deliveryAddress,
      paymentMethod: "card",
    });

    localStorage.removeItem("cartRestaurantId");
    setCart(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
