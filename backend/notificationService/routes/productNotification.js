const express = require('express');
const router = express.Router();
const { sendLowStockAlert, sendStockSnapshot } = require('../controllers/productNotificationCtrl');

// Low stock alert from product service
router.post('/product/low-stock', sendLowStockAlert);

// Inventory snapshot (current stock overview)
router.post('/product/stock-snapshot', sendStockSnapshot);

module.exports = router;
