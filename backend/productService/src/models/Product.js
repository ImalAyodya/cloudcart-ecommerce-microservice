const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  sku: { type: String },
  status: { type: String, enum: ['Active', 'Inactive', 'Draft'], default: 'Active' },
  featured: { type: Boolean, default: false },
  imageUrl: { type: String }, // For image upload, optional
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);