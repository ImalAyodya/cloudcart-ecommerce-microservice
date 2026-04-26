/**
 * Notification Routes
 * API endpoints for sending various types of notifications
 */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST /api/notifications/send-email - Send generic email
router.post('/send-email', notificationController.sendEmail);

// POST /api/notifications/send-payment-receipt - Send payment receipt
router.post('/send-payment-receipt', notificationController.sendPaymentReceipt);

// POST /api/notifications/send-order-confirmation - Send order confirmation
router.post('/send-order-confirmation', notificationController.sendOrderConfirmation);

// POST /api/notifications/send-welcome-email - Send welcome email to new users
router.post('/send-welcome-email', notificationController.sendWelcomeEmail);

// POST /api/notifications/send-password-reset - Send password reset email
router.post('/send-password-reset', notificationController.sendPasswordReset);

module.exports = router;
