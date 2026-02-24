const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/env");
const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
  });
});

module.exports = app;
