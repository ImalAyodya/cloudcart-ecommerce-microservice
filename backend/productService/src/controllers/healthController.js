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

//info controller
const getInfo = (req, res) => {
  res.status(200).json({
    service: "Product Service",
    author: "Sithmaka Nanayakkara",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth, getInfo };

