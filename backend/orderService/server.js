const express = require("express");
const cors = require("cors");
const { PORT } = require("./src/config/env");
const connectDB = require("./src/config/db");
const orderRoutes = require("./src/routes/orderRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);
app.get("/api/orders/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "Order Service" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
  });
});

module.exports = app;