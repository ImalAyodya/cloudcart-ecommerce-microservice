const mongoose = require("mongoose");

// GET /api/orders/health
const getHealth = (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.status(200).json({
    status: "OK",
    service: "Order Service",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
};

// GET /api/orders/health/info
const getInfo = (req, res) => {
  res.status(200).json({
    service: "Order Service",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth, getInfo };