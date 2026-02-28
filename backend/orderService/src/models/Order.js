const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
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
  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  },
  status: {
    type: String,
    enum: ["CREATED", "CANCELLED"],
    default: "CREATED"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);