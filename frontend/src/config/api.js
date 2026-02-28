/**
 * Centralized API Configuration
 *
 * All microservice routes go through the single API Gateway.
 * The gateway URL is read once from the VITE_ env variable and
 * every service-specific base path is derived here so the rest
 * of the app never hard-codes URLs.
 */

const API_GATEWAY_URL =
  import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:3000";

/* ── per-service base paths (relative to the gateway) ────── */
const API = {
  gateway: API_GATEWAY_URL,

  // Product Service
  products: `${API_GATEWAY_URL}/api/products`,

  // User / Auth Service
  users: `${API_GATEWAY_URL}/api/users`,

  // Order Service
  orders: `${API_GATEWAY_URL}/api/orders`,

  // Payment Service
  payments: `${API_GATEWAY_URL}/api/payments`,
};

export default API;
