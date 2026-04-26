const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5002,
  MONGO_URI: process.env.MONGO_URI,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || "http://localhost:5001",
  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5003",
};