
/**
 * Product Service – API calls
 *
 * Every function talks to the API Gateway; the gateway
 * forwards requests to the actual Product micro-service.
 */

import API from "../config/api";

// Example: Health check function
export const checkProductServiceHealth = async () => {
  try {
    const response = await fetch(`${API.products}/health`);
    const data = await response.json();
    console.log("✅ Product Service Health:", data);
    return data;
  } catch (error) {
    console.error("❌ Product Service Health Check Failed:", error.message);
    throw error;
  }
};

// Create product
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API.products}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Product creation failed:", error.message);
    throw error;
  }
};

