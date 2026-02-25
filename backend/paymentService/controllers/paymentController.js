const Payment = require('../models/Payment');

// Generate transaction ID
function generateTransactionId() {
  return 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Process payment controller
exports.processPayment = async (req, res) => {
  try {
    const { orderId, userId, amount, paymentMethod } = req.body;

    // Validate required fields
    if (!orderId || !userId || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify amount > 0
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

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
      amount,
      paymentMethod,
      transactionId,
      status,
    });
    await payment.save();

    // Return response
    res.status(201).json({
      orderId,
      userId,
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
