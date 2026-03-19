const Product = require('../models/Product');
const notificationClient = require('../services/notificationClient');
const { LOW_STOCK_THRESHOLD } = require('../config/env');

const notifyLowStockIfNeeded = async (product) => {
  const isLowStock = product.stock <= LOW_STOCK_THRESHOLD || ['Low Stock', 'Out of Stock'].includes(product.status);
  if (!isLowStock) return;

  await notificationClient.sendLowStockAlert({
    productId: product._id,
    name: product.name,
    stock: product.stock,
    status: product.status,
    category: product.category,
    threshold: LOW_STOCK_THRESHOLD,
  });
};

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
    await notifyLowStockIfNeeded(product);
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


// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await notifyLowStockIfNeeded(product);
    res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/products/:id/qty
exports.updateProductQty = async (req, res) => {
  try {
    const { qty } = req.body;
    if (typeof qty !== 'number') {
      return res.status(400).json({ error: 'qty must be a number' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product.stock = qty;
    await product.save();
    await notifyLowStockIfNeeded(product);
    res.status(200).json({ message: 'Product quantity updated', product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /api/products/stats
exports.getProductStats = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const active = await Product.countDocuments({ status: 'Active' });
    // Low Stock: status === 'Low Stock' or stock > 0 && stock <= LOW_STOCK_THRESHOLD
    const lowStock = await Product.countDocuments({ $or: [ { status: 'Low Stock' }, { stock: { $gt: 0, $lte: LOW_STOCK_THRESHOLD } } ] });
    // Out of Stock: status === 'Out of Stock' or stock === 0
    const outOfStock = await Product.countDocuments({ $or: [ { status: 'Out of Stock' }, { stock: 0 } ] });
    res.status(200).json({ total, active, lowStock, outOfStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/products/notify/stock-report
exports.sendStockReport = async (req, res) => {
  try {
    const products = await Product.find().select('name stock status category');

    const summary = {
      total: products.length,
      active: products.filter((p) => p.status === 'Active').length,
      lowStock: products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length,
      outOfStock: products.filter((p) => p.stock === 0 || p.status === 'Out of Stock').length,
    };

    const lowStockProducts = products
      .filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
      .map((p) => ({
        id: p._id,
        name: p.name,
        stock: p.stock,
        status: p.status,
        category: p.category,
      }));

    await notificationClient.sendStockSnapshot({
      summary,
      lowStockProducts,
      recipientEmail: req.body.recipientEmail,
      generatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Stock report sent', summary, lowStockProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};