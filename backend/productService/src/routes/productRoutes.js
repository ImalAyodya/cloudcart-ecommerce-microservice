const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, updateProductQty, getProductStats, sendStockReport, getProductAvailability, reduceProductStock } = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/auth');
// Reduce product stock
router.patch('/:id/reduce-stock', protect, adminOnly, reduceProductStock);
// Get product availability
router.get('/:id/availability', getProductAvailability);

// Create product
router.post('/', protect, adminOnly, createProduct);

// Get all products
router.get('/', getAllProducts);

// Get product statistics
router.get('/stats', getProductStats);

// Send stock report to notification service
router.post('/notify/stock-report', protect, adminOnly, sendStockReport);

// Get product by ID
router.get('/:id', getProductById);

// Update product
router.put('/:id', protect, adminOnly, updateProduct);

// Delete product
router.delete('/:id', protect, adminOnly, deleteProduct);

// Update product quantity
router.patch('/:id/qty', protect, adminOnly, updateProductQty);

module.exports = router;