const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST /payments/process
router.post('/process', paymentController.processPayment);

// GET /payments/:id
router.get('/:id', paymentController.getPaymentById);


// PUT /payments/:id/status (admin)
router.put('/:id/status', paymentController.updatePaymentStatus);

module.exports = router;
