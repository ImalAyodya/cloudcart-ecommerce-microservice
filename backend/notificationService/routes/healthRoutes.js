/**
 * Health Check Routes
 * Endpoints for monitoring service health and status
 */

const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// GET /api/health - Basic health check
router.get('/', healthController.getHealth);

module.exports = router;
