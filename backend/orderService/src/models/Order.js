const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  OrderId: {
    type: String,
    index: { unique: true, sparse: true }
  },
  OrderNumber: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    required: true
  },
  products: [
    {
      productId: String,
      productName: String,
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

orderSchema.pre("validate", function ensureOrderIdFromMongoId() {
  if (!this.OrderId && this._id) {
    this.OrderId = String(this._id);
  }
});

module.exports = mongoose.model("Order", orderSchema);