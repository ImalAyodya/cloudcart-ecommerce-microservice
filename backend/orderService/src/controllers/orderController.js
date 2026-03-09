const Order = require("../models/Order");
const mongoose = require("mongoose");
const {
  checkProductAvailability,
  getPaymentByTransactionId,
} = require("../services/externalServices");

const toErrorLogPayload = (error) => ({
  message: error?.message,
  stack: error?.stack,
  upstreamStatus: error?.response?.status,
  upstreamData: error?.response?.data,
  upstreamUrl: error?.config?.url,
  upstreamMethod: error?.config?.method,
});

const normalizeId = (value) => String(value || "").trim();

const isAdminUser = (req) => String(req.user?.role || "").toLowerCase() === "admin";

const isOrderOwner = (order, req) => normalizeId(order?.userId) === normalizeId(req.user?.id);

const parsePagination = (query = {}) => {
  const rawPage = Number(query.page);
  const rawLimit = Number(query.limit);

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : null;

  return {
    page,
    limit,
    skip: limit ? (page - 1) * limit : 0,
  };
};

const normalizeOrderDocument = (orderDoc) =>
  typeof orderDoc?.toObject === "function" ? orderDoc.toObject() : orderDoc;

const resolveProductName = async (productId, quantity, productNameCache) => {
  if (!productId) {
    return "";
  }

  if (!productNameCache.has(productId)) {
    const namePromise = (async () => {
      try {
        const availability = await checkProductAvailability(productId, quantity || 1);
        const product = availability?.product || availability;
        return String(product?.name || "").trim();
      } catch (error) {
        console.warn("[OrderController.resolveProductName]", {
          ...toErrorLogPayload(error),
          productId,
        });
        return "";
      }
    })();

    productNameCache.set(productId, namePromise);
  }

  return productNameCache.get(productId);
};

const toProductWithName = (productItem, resolvedName) => {
  const safeName = String(resolvedName || "").trim();
  if (safeName) {
    return {
      ...productItem,
      productName: safeName,
      name: safeName,
    };
  }

  return {
    ...productItem,
    productName: null,
    name: String(productItem?.name || "").trim() || null,
  };
};

const attachProductNamesToOrder = async (order, productNameCache = new Map()) => {
  const orderPayload = normalizeOrderDocument(order);

  if (!orderPayload || !Array.isArray(orderPayload.products) || orderPayload.products.length === 0) {
    return orderPayload;
  }

  orderPayload.products = await Promise.all(
    orderPayload.products.map(async (productItem) => {
      const productId = String(productItem?.productId || "").trim();
      if (!productId) {
        return toProductWithName(productItem, "");
      }

      const existingName = String(
        productItem?.productName || productItem?.name || ""
      ).trim();

      if (existingName) {
        return toProductWithName(productItem, existingName);
      }

      const resolvedName = await resolveProductName(
        productId,
        productItem?.quantity,
        productNameCache
      );
      return toProductWithName(productItem, resolvedName);
    })
  );

  return orderPayload;
};

const attachProductNamesToOrders = async (orders = []) => {
  const productNameCache = new Map();
  return Promise.all(
    orders.map((order) => attachProductNamesToOrder(order, productNameCache))
  );
};

exports.createOrder = async (req, res) => {
  try {
    const { products, transactionId: requestedTransactionId } = req.body;
    const authHeader = req.headers.authorization;
    const userId = normalizeId(req.user?.id);
    const userEmail = normalizeId(req.user?.email).toLowerCase();
    const isAdmin = isAdminUser(req);

    if (!userId) {
      return res.status(401).json({ message: "Invalid token or user not found" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "products are required" });
    }

    const requestedTransactionIdTrimmed = String(requestedTransactionId || "").trim();
    if (!requestedTransactionIdTrimmed) {
      return res.status(400).json({ message: "transactionId is required" });
    }

    const existingOrder = await Order.findOne({ transactionId: requestedTransactionIdTrimmed });
    if (existingOrder) {
      if (!isAdmin && normalizeId(existingOrder.userId) !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const existingOrderPayload = await attachProductNamesToOrder(existingOrder);
      return res.status(200).json({
        message: "Order already exists for transactionId",
        order: existingOrderPayload,
        transactionId: existingOrder.transactionId,
        orderNumber: existingOrder.OrderNumber,
      });
    }

    for (const item of products) {
      if (!item.productId || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) <= 0) {
        return res.status(400).json({ message: "Each product needs productId and quantity > 0" });
      }
    }

    let totalAmount = 0;
    const normalizedProducts = [];

    // 2) Check product availability and resolve authoritative price from product service
    for (const item of products) {
      const availability = await checkProductAvailability(item.productId, item.quantity);
      const product = availability?.product || availability;
      const stock = Number(availability?.stock ?? product?.stock ?? 0);

      if (Number(stock) < Number(item.quantity)) {
        return res.status(400).json({
          message: `Insufficient stock for product ${item.productId}`,
        });
      }

      const price = Number(product?.price);
      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          message: `Invalid price for product ${item.productId}`,
        });
      }

      const quantity = Number(item.quantity);
      const productName = String(product?.name || item.productName || item.name || "").trim();
      totalAmount += price * quantity;

      normalizedProducts.push({
        productId: item.productId,
        quantity,
        price,
        ...(productName ? { productName } : {}),
      });
    }

    // 3) Use existing payment record from transactionId
    let paymentDetails;
    try {
      paymentDetails = await getPaymentByTransactionId(requestedTransactionIdTrimmed, authHeader);
    } catch (lookupError) {
      const lookupStatus = Number(lookupError?.response?.status) || 502;
      const lookupMessage =
        lookupError?.response?.data?.error ||
        lookupError?.response?.data?.message ||
        lookupError?.message ||
        "Payment lookup failed";

      return res.status(lookupStatus).json({
        error: "Unable to resolve payment by transactionId",
        details: lookupMessage,
      });
    }

    const transactionId = String(paymentDetails?.transactionId || "").trim();
    const paymentOrderNumber = String(paymentDetails?.orderId || "").trim();
    const paymentStatus = String(paymentDetails?.status || "").trim().toUpperCase();
    const paymentAmount = Number(paymentDetails?.amount);
    const paymentUserId = normalizeId(paymentDetails?.userId);
    const paymentEmail = normalizeId(paymentDetails?.email).toLowerCase();

    if (!transactionId) {
      return res.status(502).json({
        error: "Payment record does not contain transactionId",
        payment: paymentDetails,
      });
    }

    if (!paymentOrderNumber) {
      return res.status(502).json({
        error: "Payment record does not contain orderId",
        payment: paymentDetails,
      });
    }

    if (!isAdmin && paymentUserId && paymentUserId !== userId) {
      return res.status(403).json({
        error: "Payment does not belong to authenticated user",
      });
    }

    if (!isAdmin && paymentEmail && userEmail && paymentEmail !== userEmail) {
      return res.status(403).json({
        error: "Payment email does not match authenticated user",
      });
    }

    if (Number.isFinite(paymentAmount) && Math.abs(paymentAmount - totalAmount) > 0.01) {
      return res.status(400).json({
        error: "Payment amount does not match calculated order total",
        paymentAmount,
        totalAmount,
      });
    }

    if (paymentStatus && paymentStatus !== "SUCCESS") {
      return res.status(400).json({
        error: "Payment is not successful",
        paymentStatus,
      });
    }

    // Create confirmed order using payment transaction details
    const order = new Order({
      userId,
      products: normalizedProducts,
      totalAmount,
      paymentStatus: "SUCCESS",
      status: "CONFIRMED",
      transactionId,
      OrderNumber: paymentOrderNumber,
    });
    await order.save();

    res.status(201).json({
      message: "Order created",
      order,
      transactionId,
      orderNumber: order.OrderNumber,
    });

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
        hasTransactionId: Boolean(String(req.body?.transactionId || "").trim()),
        hasAuthorizationHeader: Boolean(req.headers?.authorization),
      },
    });

    const errorResponse = { error: message };
    if (Array.isArray(responseData?.missingFields)) {
      errorResponse.missingFields = responseData.missingFields;
    }

    return res.status(statusCode).json(errorResponse);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!isAdminUser(req) && !isOrderOwner(order, req)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const enrichedOrder = await attachProductNamesToOrder(order);
    return res.json(enrichedOrder);
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
    const requestedUserId = normalizeId(req.params.userId);
    if (!requestedUserId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!isAdminUser(req) && requestedUserId !== normalizeId(req.user?.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { skip, limit } = parsePagination(req.query);
    const query = Order.find({ userId: requestedUserId }).sort({ createdAt: -1 }).skip(skip);
    if (limit) {
      query.limit(limit);
    }

    const orders = await query;
    const enrichedOrders = await attachProductNamesToOrders(orders);
    return res.json(enrichedOrders);
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
    const { skip, limit } = parsePagination(req.query);
    const query = Order.find().sort({ createdAt: -1 }).skip(skip);
    if (limit) {
      query.limit(limit);
    }

    const orders = await query;
    const enrichedOrders = await attachProductNamesToOrders(orders);
    return res.json(enrichedOrders);
  } catch (error) {
    console.error("[OrderController.getAllOrders]", toErrorLogPayload(error));
    return res.status(500).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!isAdminUser(req) && !isOrderOwner(order, req)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (order.status === "CANCELLED") {
      return res.status(409).json({ message: "Order already cancelled", order });
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