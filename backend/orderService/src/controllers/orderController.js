const Order = require("../models/Order");
const {
  validateUser,
  checkProductAvailability,
  processPayment,
  reduceStock
} = require("../services/externalServices");

exports.createOrder = async (req, res) => {
  try {
    const { userId, products } = req.body;

    // 1️⃣ Validate User
    await validateUser(userId);

    let totalAmount = 0;

    // 2️⃣ Check product availability
    for (let item of products) {
      const product = await checkProductAvailability(item.productId);

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      totalAmount += product.price * item.quantity;
    }

    // 3️⃣ Process payment
    const paymentResponse = await processPayment({
      userId,
      amount: totalAmount
    });

    if (!paymentResponse.success) {
      return res.status(400).json({ message: "Payment failed" });
    }

    // 4️⃣ Reduce stock
    for (let item of products) {
      await reduceStock(item.productId, item.quantity);
    }

    // 5️⃣ Save order
    const order = await Order.create({
      userId,
      products,
      totalAmount,
      paymentStatus: "SUCCESS"
    });

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
};

exports.getOrdersByUser = async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders);
};