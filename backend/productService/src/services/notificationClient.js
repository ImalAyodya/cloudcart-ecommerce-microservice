const axios = require('axios');
const { NOTIFICATION_SERVICE_URL } = require('../config/env');

const client = axios.create({
  baseURL: NOTIFICATION_SERVICE_URL,
  timeout: 5000,
});

const sendLowStockAlert = async (payload) => {
  try {
    await client.post('/product/low-stock', payload);
  } catch (error) {
    console.error('Failed to notify low stock:', error.message);
  }
};

const sendStockSnapshot = async (payload) => {
  try {
    await client.post('/product/stock-snapshot', payload);
  } catch (error) {
    console.error('Failed to send stock snapshot:', error.message);
  }
};

module.exports = {
  sendLowStockAlert,
  sendStockSnapshot,
};
