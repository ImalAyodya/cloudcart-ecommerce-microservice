const mongoose = require("mongoose");

// GET /api/health
const getHealth = (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.status(200).json({
    status: "OK",
    service: "Product Service",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
};

module.exports = { getHealth };
