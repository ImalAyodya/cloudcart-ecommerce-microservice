/**
 * Product Service – API calls
 *
 * Every function talks to the API Gateway; the gateway
 * forwards requests to the actual Product micro-service.
 */

import API from "../config/api";

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API.products}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Get all products failed:", error.message);
    throw error;
  }
};

// Get product statistics
export const getProductStats = async () => {
  try {
    const response = await fetch(`${API.products}/stats`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Get product stats failed:", error.message);
    throw error;
  }
};

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

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API.products}/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Get product by ID failed:", error.message);
    throw error;
  }
};

// Update product
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API.products}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Update product failed:", error.message);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API.products}/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Delete product failed:", error.message);
    throw error;
  }
};

// Update product quantity
export const updateProductQty = async (id, qty) => {
  try {
    const response = await fetch(`${API.products}/${id}/qty`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qty }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Update product quantity failed:", error.message);
    throw error;
  }
};

