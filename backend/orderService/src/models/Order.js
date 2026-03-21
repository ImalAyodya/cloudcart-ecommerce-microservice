const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  OrderId: {
    type: String,
    trim: true,
    index: { unique: true, sparse: true }
  },
  OrderNumber: {
    type: String,
    trim: true,
    index: true,
    default: null
  },
  userId: {
    type: String,
    trim: true,
    index: true,
    required: true
  },
  products: [
    {
      productId: {
        type: String,
        trim: true,
        required: true,
      },
      productName: {
        type: String,
        trim: true,
        default: null,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      }
    }
  ],
  totalAmount: {
    type: Number,
    min: 0,
    required: true
  },
  transactionId: {
    type: String,
    trim: true,
    index: { unique: true, sparse: true },
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