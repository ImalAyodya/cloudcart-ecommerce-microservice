//Environment variable loader
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5003/api/notifications',
  LOW_STOCK_THRESHOLD: Number(process.env.LOW_STOCK_THRESHOLD || 5),
};