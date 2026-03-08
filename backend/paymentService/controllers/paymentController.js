const Payment = require('../models/Payment');
const axios = require('axios');
const { NOTIFICATION_SERVICE_URL } = require('../config/config');

// Generate transaction ID
function generateTransactionId() {
  return 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Process payment controller
exports.processPayment = async (req, res) => {
  try {
    const { orderId, userId, email, amount, paymentMethod } = req.body;

    // req.user is now available from the protect middleware
    const authenticatedUser = req.user;

    // Validate required fields and return exactly which ones are missing.
    const missingFields = [];
    if (!orderId) missingFields.push('orderId');
    if (!userId) missingFields.push('userId');
    if (!email) missingFields.push('email');
    if (amount === undefined || amount === null || amount === '') missingFields.push('amount');
    if (!paymentMethod) missingFields.push('paymentMethod');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Verify amount > 0
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Optional: Verify authenticated user matches the userId (security check)
    // Uncomment if you want strict user matching
    // if (authenticatedUser._id.toString() !== userId && authenticatedUser.role !== 'admin') {
    //   return res.status(403).json({ error: 'You can only process payments for your own account' });
    // }

    // Check if payment already exists for this order
    const existing = await Payment.findOne({ orderId });
    if (existing) {
      return res.status(409).json({ error: 'Payment already processed for this order' });
    }

    // Generate transaction ID
    const transactionId = generateTransactionId();

    // Simulate payment gateway (random success/fail)
    const isSuccess = Math.random() < 0.9; // 90% success rate
    const status = isSuccess ? 'SUCCESS' : 'FAILED';

    // Save to MongoDB
    const payment = new Payment({
      orderId,
      userId,
      email,
      amount,
      paymentMethod,
      transactionId,
      status,
    });
    await payment.save();

    // Send payment receipt email via notification service (non-blocking)
    axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/send-payment-receipt`, {
      recipientEmail: email,
      paymentDetails: {
        orderId,
        transactionId,
        amount,
        paymentMethod,
        status,
        createdAt: payment.createdAt,
      }
    }).catch((err) => console.error('Email send error:', err.message));

    // Return response
    res.status(201).json({
      orderId,
      userId,
      email,
      amount,
      paymentMethod,
      transactionId,
      status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Get payment details by ID
exports.getPaymentById = async (req, res) => {
  try {
    // req.user is available from the protect middleware
    const authenticatedUser = req.user;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Optional: Verify user can only view their own payments (unless admin)
    // Uncomment if you want strict access control
    // if (payment.userId !== authenticatedUser._id.toString() && authenticatedUser.role !== 'admin') {
    //   return res.status(403).json({ error: 'You can only view your own payments' });
    // }

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update payment status (admin function)
exports.updatePaymentStatus = async (req, res) => {
  try {
    // req.user is available and already verified as admin by adminOnly middleware
    
    const { status } = req.body;
    const allowedStatuses = ['SUCCESS', 'FAILED', 'REFUNDED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
