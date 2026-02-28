/**
 * Payment Service – API calls
 *
 * Every function talks to the API Gateway; the gateway
 * forwards requests to the actual Payment micro-service.
 */

import API from "../config/api";

// Health check
export const checkPaymentServiceHealth = async () => {
  try {
    const response = await fetch(`${API.payments}/health`);
    const data = await response.json();
    console.log("✅ Payment Service Health:", data);
    return data;
  } catch (error) {
    console.error("❌ Payment Service Health Check Failed:", error.message);
    throw error;
  }
};

// Process a payment
export const processPayment = async (paymentData) => {
  try {
    const response = await fetch(`${API.payments}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Payment processing failed:", error.message);
    throw error;
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId) => {
  try {
    const response = await fetch(`${API.payments}/${paymentId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch payment:", error.message);
    throw error;
  }
};

// Update payment status (admin)
export const updatePaymentStatus = async (paymentId, status) => {
  try {
    const response = await fetch(`${API.payments}/${paymentId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Failed to update payment status:", error.message);
    throw error;
  }
};
