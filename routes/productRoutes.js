const express = require('express');
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct } = require('../controller/productController');
const isAdmin = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new product
router.post('/', createProduct);

// Get a product
router.get('/:id', getaProduct);

// Get all products
router.get('/', getAllProducts);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

module.exports = router;