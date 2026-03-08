import API from "../config/api";

const parseError = async (response) => {
  try {
    const data = await response.json();
    return data?.message || data?.error || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API.orders}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const getOrdersByUser = async (userId) => {
  const response = await fetch(`${API.orders}/user/${userId}`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const getOrderById = async (orderId) => {
  const response = await fetch(`${API.orders}/${orderId}`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const cancelOrder = async (orderId) => {
  const response = await fetch(`${API.orders}/${orderId}/cancel`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};
