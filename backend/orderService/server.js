require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const orderRoutes = require("./src/routes/orderRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", orderRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Order DB Connected");

    app.listen(process.env.PORT, () => {
      console.log(`Order Service running on port ${process.env.PORT}`);
    });

  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });