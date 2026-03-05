const axios = require("axios");
const {
  USER_SERVICE_URL,
  PRODUCT_SERVICE_URL,
  PAYMENT_SERVICE_URL,
} = require("../config/env");

const validateUser = async (userId) => {
  const response = await axios.get(
    `${USER_SERVICE_URL}/api/users/${userId}`
  );
  return response.data;
};

const checkProductAvailability = async (productId, quantity = 1) => {
  const response = await axios.get(
    `${PRODUCT_SERVICE_URL}/api/products/${productId}/availability`,
    { params: { quantity } }
  );
  return response.data;
};

const processPayment = async (paymentData) => {
  const response = await axios.post(
    `${PAYMENT_SERVICE_URL}/api/payments/process`,
    paymentData
  );
  return response.data;
};

const reduceStock = async (productId, quantity) => {
  await axios.post(
    `${PRODUCT_SERVICE_URL}/api/products/${productId}/reduce-stock`,
    { quantity }
  );
};

module.exports = {
  validateUser,
  checkProductAvailability,
  processPayment,
  reduceStock
};