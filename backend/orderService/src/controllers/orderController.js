const Order = require("../models/Order");
const {
  validateUser,
  checkProductAvailability,
  getPaymentByTransactionId,
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

const extractTransactionId = (paymentResponse) => {
  const rawTransactionId =
    paymentResponse?.transactionId ||
    paymentResponse?.payment?.transactionId ||
    paymentResponse?.data?.transactionId ||
    paymentResponse?.transaction?.id ||
    paymentResponse?.payment?.transaction?.id ||
    "";

  return String(rawTransactionId || "").trim();
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

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "products are required" });
    }

    const requestedTransactionIdTrimmed = String(requestedTransactionId || "").trim();
    if (!requestedTransactionIdTrimmed) {
      return res.status(400).json({ message: "transactionId is required" });
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
      paymentDetails = await getPaymentByTransactionId(requestedTransactionIdTrimmed);
    } catch (lookupError) {
      const lookupStatus = Number(lookupError?.response?.status) || 502;
      const lookupMessage =
        lookupError?.response?.data?.error ||
        lookupError?.response?.data?.message ||
        lookupError?.message ||
        "Payment lookup failed";

      return res.status(502).json({
        error: "Unable to resolve payment by transactionId",
        status: lookupStatus,
        details: lookupMessage,
      });
    }

    const transactionId = String(paymentDetails?.transactionId || "").trim();
    const paymentOrderNumber = String(paymentDetails?.orderId || "").trim();
    const paymentStatus = String(paymentDetails?.status || "").trim().toUpperCase();
    const paymentAmount = Number(paymentDetails?.amount);

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
    order.OrderId = String(order._id);

    // 4) Reduce stock
    // for (const item of normalizedProducts) {
    //   await reduceStock(item.productId, item.quantity);
    // }

    // 5) Finalize order
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
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
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
    const orders = await Order.find().sort({ createdAt: -1 });
    const enrichedOrders = await attachProductNamesToOrders(orders);
    return res.json(enrichedOrders);
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