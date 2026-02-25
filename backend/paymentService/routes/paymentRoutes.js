const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST /payments/process
router.post('/process', paymentController.processPayment);

module.exports = router;
