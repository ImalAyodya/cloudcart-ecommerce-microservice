const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Service URLs from environment variables
const services = {
  products: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5000',
  users: process.env.USER_SERVICE_URL || 'http://localhost:5001',
  orders: process.env.ORDER_SERVICE_URL || 'http://localhost:5003',
  payments: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5002'
};

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services
  });
});

// Forward requests to microservices
app.use('/api/:service', async (req, res) => {
  const { service } = req.params;
  const serviceUrl = services[service];

  if (!serviceUrl) {
    return res.status(404).json({ error: `Service '${service}' not found` });
  }

  // Build the target URL: forward full path to the service
  // e.g. /api/products → http://localhost:5000/api/products
  // e.g. /api/products/health → http://localhost:5000/api/products/health
  const remainingPath = req.originalUrl.replace(`/api/${service}`, '') || '';
  const targetUrl = `${serviceUrl}/api/${service}${remainingPath}`;

  console.log(`Forwarding ${req.method} ${req.originalUrl} → ${targetUrl}`);

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      timeout: 10000,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`${service} service error:`, error.message);
      res.status(503).json({
        error: `${service} service unavailable`,
        message: error.message
      });
    }
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('API Gateway Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
  console.log('Service Routes:');
  Object.entries(services).forEach(([name, url]) => {
    console.log(`  /api/${name} → ${url}`);
  });
});

module.exports = app;