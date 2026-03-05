const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5003,
  MONGO_URI: process.env.MONGO_URI,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || "http://localhost:5001",
  PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL || "http://localhost:5000",
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || "http://localhost:5002",
};
