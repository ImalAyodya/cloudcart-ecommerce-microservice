const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getAllOrders,
  cancelOrder,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/user/:userId", getOrdersByUser);
router.get("/:id", getOrderById);
router.patch("/:id/cancel", cancelOrder);

module.exports = router;