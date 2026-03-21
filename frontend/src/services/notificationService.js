import API from "../config/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Trigger low stock alert email directly via notification service
export const sendLowStockAlert = async (products, recipientEmail) => {
  const payload = {
    recipientEmail,
    products,
  };
  const response = await fetch(`${API.notifications}/product/low-stock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || `HTTP ${response.status}`);
  }
  return data;
};

// Trigger stock snapshot email directly via notification service
export const sendStockSnapshot = async (summary, lowStockProducts, recipientEmail) => {
  const payload = {
    recipientEmail,
    summary,
    lowStockProducts,
    generatedAt: new Date().toISOString(),
  };
  const response = await fetch(`${API.notifications}/product/stock-snapshot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || `HTTP ${response.status}`);
  }
  return data;
};

// Ask product service to compile and send a stock report (it will call notification service)
export const sendProductStockReport = async (recipientEmail) => {
  const payload = recipientEmail ? { recipientEmail } : {};
  const response = await fetch(`${API.products}/notify/stock-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || `HTTP ${response.status}`);
  }
  return data;
};
