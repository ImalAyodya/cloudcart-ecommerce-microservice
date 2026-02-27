const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts } = require('../controllers/productController');

// Create product
router.post('/', createProduct);

// Get all products
router.get('/', getAllProducts);

module.exports = router;