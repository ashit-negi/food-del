const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // ✅ MUST BE AT TOP

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const restaurantRoute = require("./routes/restaurantRoutes");
const foodRoutes = require("./routes/foodRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/restaurants", restaurantRoute);
app.use("/api/food", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Food Delivery Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});

// console.log({} + []);

// let obj = {
//   a: 1,
//   b: undefined,
// };
// console.log(obj.a?.b?.c?.d ?? "ashit");

// console.log([] + {}); // [object object]
// console.log({} + []); // ""
// console.log([] == ![]); //true
// console.log([] == []); //false
// console.log([] === ![]); // false
// console.log(typeof NaN);
