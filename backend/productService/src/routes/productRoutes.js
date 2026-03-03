const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, updateProductQty, getProductStats } = require('../controllers/productController');

// Create product
router.post('/', createProduct);

// Get all products
router.get('/', getAllProducts);

// Get product statistics
router.get('/stats', getProductStats);

// Get product by ID
router.get('/:id', getProductById);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

// Update product quantity
router.patch('/:id/qty', updateProductQty);

module.exports = router;