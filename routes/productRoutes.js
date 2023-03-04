const express = require('express');
const { createProduct, getaProduct, getAllProducts } = require('../controller/productController');
const router = express.Router();

// Create a new product
router.post('/', createProduct);

// Get a product
router.get('/:id', getaProduct);

// Get all products
router.get('/', getAllProducts);

module.exports = router;