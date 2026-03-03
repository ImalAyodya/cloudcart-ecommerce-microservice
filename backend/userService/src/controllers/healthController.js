const mongoose = require("mongoose");

const healthCheck = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1
      ? "connected"
      : dbState === 2
      ? "connecting"
      : "disconnected";

  res.status(dbState === 1 ? 200 : 503).json({
    service: "user-service",
    status: dbState === 1 ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
  });
};

module.exports = { healthCheck };