const axios = require("axios");
const {
  USER_SERVICE_URL,
  PRODUCT_SERVICE_URL,
  PAYMENT_SERVICE_URL,
} = require("../config/env");

const HTTP_TIMEOUT_MS = 10000;

const validateUser = async (authorizationHeader) => {
  const response = await axios.get(`${USER_SERVICE_URL}/api/auth/profile`, {
    headers: {
      Authorization: authorizationHeader,
    },
    timeout: HTTP_TIMEOUT_MS,
  });
  return response.data;
};

const checkProductAvailability = async (productId, quantity = 1) => {
  const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`, {
    timeout: HTTP_TIMEOUT_MS,
  });
  const product = response.data.product || response.data;
  const stock = Number(product.stock ?? 0);

  return {
    product,
    stock,
    available: stock >= Number(quantity),
  };
};

const getPaymentByTransactionId = async (transactionId, authorizationHeader) => {
  const response = await axios.get(
    `${PAYMENT_SERVICE_URL}/api/payments/transaction/${encodeURIComponent(transactionId)}`,
    {
      headers: {
        ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
      },
      timeout: HTTP_TIMEOUT_MS,
    }
  );
  return response.data;
};

const reduceStock = async (productId, quantity) => {
  const current = await checkProductAvailability(productId, quantity);
  const updatedQty = Number(current.stock) - Number(quantity);

  await axios.patch(
    `${PRODUCT_SERVICE_URL}/api/products/${productId}/qty`,
    {
      qty: updatedQty,
    },
    {
      timeout: HTTP_TIMEOUT_MS,
    }
  );
};

module.exports = {
  validateUser,
  checkProductAvailability,
  getPaymentByTransactionId,
  reduceStock
};