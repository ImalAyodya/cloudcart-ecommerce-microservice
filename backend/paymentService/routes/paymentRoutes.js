const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/auth');

// POST /payments/process - Protected route (requires authentication)
router.post('/process', protect, paymentController.processPayment);

// GET /payments/transaction/:transactionId
router.get('/transaction/:transactionId', paymentController.getPaymentByTransactionId);

// GET /payments/:id
router.get('/:id', paymentController.getPaymentById);

// PUT /payments/:id/status - Admin only route
router.put('/:id/status', protect, adminOnly, paymentController.updatePaymentStatus);

module.exports = router;
