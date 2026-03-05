const Order = require("../models/Order");
const {
  validateUser,
  checkProductAvailability,
  processPayment,
  reduceStock
} = require("../services/externalServices");

exports.createOrder = async (req, res) => {
  try {
    const { userId, products, paymentMethod = "CARD" } = req.body;

    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "userId and products are required" });
    }

    for (const item of products) {
      if (!item.productId || !item.quantity || Number(item.quantity) <= 0) {
        return res.status(400).json({ message: "Each product needs productId and quantity > 0" });
      }
    }

    // 1️⃣ Validate User
    await validateUser(userId);

    let totalAmount = 0;
    const normalizedProducts = [];

    // 2️⃣ Check product availability
    for (const item of products) {
      const availability = await checkProductAvailability(item.productId, item.quantity);
      const product = availability.product || availability;
      const stock = availability.stock ?? product.stock ?? 0;

      if (Number(stock) < Number(item.quantity)) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      const price = Number(product.price ?? item.price ?? 0);
      totalAmount += price * Number(item.quantity);

      normalizedProducts.push({
        productId: item.productId,
        quantity: Number(item.quantity),
        price,
      });
    }

    // create pending order first to get orderId for payment service
    const order = await Order.create({
      userId,
      products: normalizedProducts,
      totalAmount,
      paymentStatus: "PENDING",
      status: "CREATED",
    });

    // 3️⃣ Process payment
    const paymentResponse = await processPayment({
      orderId: String(order._id),
      userId,
      amount: totalAmount,
      paymentMethod,
    });

    if (paymentResponse.status !== "SUCCESS") {
      order.paymentStatus = "FAILED";
      order.status = "FAILED";
      await order.save();
      return res.status(400).json({ message: "Payment failed", order, payment: paymentResponse });
    }

    // 4️⃣ Reduce stock
    for (const item of normalizedProducts) {
      await reduceStock(item.productId, item.quantity);
    }

    // 5️⃣ Finalize order
    order.paymentStatus = "SUCCESS";
    order.status = "CONFIRMED";
    await order.save();

    res.status(201).json({ message: "Order created", order, payment: paymentResponse });

  } catch (error) {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    res.status(statusCode).json({ error: message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "CANCELLED";
    await order.save();
    return res.json({ message: "Order cancelled", order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};