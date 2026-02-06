import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SingleRestaurant from "./pages/SingleRestaurant";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import OwnerOrders from "./pages/OwnerOrders";
import OwnerFoods from "./pages/OwnerFoods";
import MyRestaurants from "./pages/MyRestaurants";

import ProtectedRoute from "./routes/ProtectedRoute";
import OwnerRoute from "./routes/OwnerRoute";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ================= CUSTOMER ROUTES ================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <SingleRestaurant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart/:restaurantId"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:restaurantId"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/:restaurantId"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/restaurants"
          element={
            <OwnerRoute>
              <MyRestaurants />
            </OwnerRoute>
          }
        />

        {/* 🔥 OWNER MANAGE ROUTES */}
        <Route
          path="/owner/foods/:restaurantId"
          element={
            <OwnerRoute>
              <OwnerFoods />
            </OwnerRoute>
          }
        />

        <Route
          path="/owner/orders/:restaurantId"
          element={
            <OwnerRoute>
              <OwnerOrders />
            </OwnerRoute>
          }
        />
      </Routes>
    </CartProvider>
  );
}

export default App;
