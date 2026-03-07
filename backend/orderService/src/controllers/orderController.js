const Order = require("../models/Order");
const {
  validateUser,
  checkProductAvailability,
  processPayment,
  reduceStock
} = require("../services/externalServices");

const toErrorLogPayload = (error) => ({
  message: error?.message,
  stack: error?.stack,
  upstreamStatus: error?.response?.status,
  upstreamData: error?.response?.data,
  upstreamUrl: error?.config?.url,
  upstreamMethod: error?.config?.method,
});

exports.createOrder = async (req, res) => {
  try {
    const { products, paymentMethod = "CARD" } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "products are required" });
    }

    // Resolve user from JWT token through user service
    const userPayload = await validateUser(authHeader);
    const userId = String(
      userPayload?._id ||
      userPayload?.id ||
      userPayload?.user?._id ||
      userPayload?.user?.id ||
      ""
    );
    const userEmail = String(userPayload?.email || userPayload?.user?.email || "");

    if (!userId) {
      return res.status(401).json({ message: "Invalid token or user not found" });
    }

    if (!userEmail) {
      return res.status(400).json({ message: "Authenticated user email is required" });
    }

    for (const item of products) {
      if (!item.productId || !item.quantity || Number(item.quantity) <= 0) {
        return res.status(400).json({ message: "Each product needs productId and quantity > 0" });
      }
    }

    // 1️⃣ User already validated via token and profile lookup

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
      email: userEmail,
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
    const statusCode = Number(error.response?.status) || 500;
    const responseData = error.response?.data;
    const message =
      responseData?.message ||
      responseData?.error ||
      (typeof responseData === "string" ? responseData : null) ||
      error.message ||
      "Internal server error";

    console.error("[OrderController.createOrder]", {
      ...toErrorLogPayload(error),
      requestSummary: {
        productCount: Array.isArray(req.body?.products) ? req.body.products.length : 0,
        paymentMethod: req.body?.paymentMethod,
        hasAuthorizationHeader: Boolean(req.headers?.authorization),
      },
    });

    return res.status(statusCode).json({ error: message });
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
    console.error("[OrderController.getOrderById]", {
      ...toErrorLogPayload(error),
      orderId: req.params?.id,
    });
    return res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error("[OrderController.getOrdersByUser]", {
      ...toErrorLogPayload(error),
      userId: req.params?.userId,
    });
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error("[OrderController.getAllOrders]", toErrorLogPayload(error));
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
    console.error("[OrderController.cancelOrder]", {
      ...toErrorLogPayload(error),
      orderId: req.params?.id,
    });
    return res.status(500).json({ error: error.message });
  }
};