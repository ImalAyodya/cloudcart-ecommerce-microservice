const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  cancelOrder,
} = require("../controllers/orderController");

router.post("/", protect, createOrder);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/user/:userId", protect, getOrdersByUser);
router.get("/:id", protect, getOrderById);
router.patch("/:id/cancel", protect, cancelOrder);

module.exports = router;