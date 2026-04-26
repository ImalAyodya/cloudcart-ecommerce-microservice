/**
 * Notification Controller
 * Handles all notification-related API requests
 */

const emailService = require('../utils/emailService');

/**
 * Send a generic email
 * POST /api/notifications/send-email
 * Body: { to, subject, html, text }
 */
const sendEmail = async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    // Validation
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, and (html or text)'
      });
    }

    const result = await emailService.sendGenericEmail({ to, subject, html, text });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
};

/**
 * Send payment receipt email
 * POST /api/notifications/send-payment-receipt
 * Body: { recipientEmail, paymentDetails }
 */
const sendPaymentReceipt = async (req, res) => {
  try {
    const { recipientEmail, paymentDetails } = req.body;

    // Validation
    if (!recipientEmail || !paymentDetails) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: recipientEmail and paymentDetails'
      });
    }

    const result = await emailService.sendPaymentReceiptEmail(recipientEmail, paymentDetails);

    res.status(200).json({
      success: true,
      message: 'Payment receipt sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending payment receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send payment receipt',
      error: error.message
    });
  }
};

/**
 * Send order confirmation email
 * POST /api/notifications/send-order-confirmation
 * Body: { recipientEmail, orderDetails }
 */
const sendOrderConfirmation = async (req, res) => {
  try {
    const { recipientEmail, orderDetails } = req.body;

    // Validation
    if (!recipientEmail || !orderDetails) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: recipientEmail and orderDetails'
      });
    }

    const result = await emailService.sendOrderConfirmationEmail(recipientEmail, orderDetails);

    res.status(200).json({
      success: true,
      message: 'Order confirmation sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send order confirmation',
      error: error.message
    });
  }
};

/**
 * Send welcome email to new users
 * POST /api/notifications/send-welcome-email
 * Body: { recipientEmail, userName }
 */
const sendWelcomeEmail = async (req, res) => {
  try {
    const { recipientEmail, userName } = req.body;

    // Validation
    if (!recipientEmail || !userName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: recipientEmail and userName'
      });
    }

    const result = await emailService.sendWelcomeEmail(recipientEmail, userName);

    res.status(200).json({
      success: true,
      message: 'Welcome email sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send welcome email',
      error: error.message
    });
  }
};

/**
 * Send password reset email
 * POST /api/notifications/send-password-reset
 * Body: { recipientEmail, resetToken, resetLink }
 */
const sendPasswordReset = async (req, res) => {
  try {
    const { recipientEmail, resetToken, resetLink } = req.body;

    // Validation
    if (!recipientEmail || (!resetToken && !resetLink)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: recipientEmail and (resetToken or resetLink)'
      });
    }

    const result = await emailService.sendPasswordResetEmail(recipientEmail, resetToken || resetLink);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email',
      error: error.message
    });
  }
};

module.exports = {
  sendEmail,
  sendPaymentReceipt,
  sendOrderConfirmation,
  sendWelcomeEmail,
  sendPasswordReset
};
