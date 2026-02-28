const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getOrdersByUser
} = require("../controllers/orderController");

router.post("/orders", createOrder);
router.get("/orders/:id", getOrderById);
router.get("/orders/user/:userId", getOrdersByUser);

module.exports = router;