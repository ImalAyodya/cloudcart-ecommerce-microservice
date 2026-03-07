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
app.get("/api/orders/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "Order Service" });
});
app.use("/api/orders", orderRoutes);

process.on("unhandledRejection", (reason) => {
  console.error("[Server.unhandledRejection]", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[Server.uncaughtException]", error);
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("[Server.startup] Failed to connect DB / start server", error);
    process.exit(1);
  });

module.exports = app;