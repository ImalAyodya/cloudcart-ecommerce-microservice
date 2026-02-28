const axios = require("axios");

const validateUser = async (userId) => {
  const response = await axios.get(
    `${process.env.USER_SERVICE_URL}/users/validate/${userId}`
  );
  return response.data;
};

const checkProductAvailability = async (productId) => {
  const response = await axios.get(
    `${process.env.PRODUCT_SERVICE_URL}/products/${productId}/availability`
  );
  return response.data;
};

const processPayment = async (paymentData) => {
  const response = await axios.post(
    `${process.env.PAYMENT_SERVICE_URL}/payments/process`,
    paymentData
  );
  return response.data;
};

const reduceStock = async (productId, quantity) => {
  await axios.post(
    `${process.env.PRODUCT_SERVICE_URL}/products/${productId}/reduce-stock`,
    { quantity }
  );
};

module.exports = {
  validateUser,
  checkProductAvailability,
  processPayment,
  reduceStock
};