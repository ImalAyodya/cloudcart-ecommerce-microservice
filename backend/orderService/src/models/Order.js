const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  OrderId: {
    type: String,
    index: { unique: true, sparse: true }
  },
  userId: {
    type: String,
    required: true
  },
  products: [
    {
      productId: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  },
  status: {
    type: String,
    enum: ["CREATED", "CONFIRMED", "FAILED", "CANCELLED"],
    default: "CREATED"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);