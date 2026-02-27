const Product = require('../models/Product');

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const {
      name, description, price, category, stock, sku, status, featured, imageUrl
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      sku,
      status,
      featured,
      imageUrl
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};