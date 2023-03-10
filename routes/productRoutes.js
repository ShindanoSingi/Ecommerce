const express = require('express');
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist } = require('../controller/productController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new product
router.post('/', authMiddleware, isAdmin, createProduct);

// Get a product
router.get('/:id', getaProduct);

// Get all products
router.get('/', getAllProducts);

// Update a wishlist
router.put('/wishlist', authMiddleware, isAdmin, addToWishlist);

// Update a product
router.put('/:id', authMiddleware, isAdmin, updateProduct);

// Delete a product
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;