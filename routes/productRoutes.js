const express = require('express');
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages } = require('../controller/productController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

// Create a new product
router.post('/', authMiddleware, isAdmin, createProduct);

// upload a photo
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImages);

// Get a product
router.get('/:id', getaProduct);

// Get all products
router.get('/', getAllProducts);

// Update a wishlist
router.put('/wishlist', authMiddleware, addToWishlist);

// Rating
router.put('/rating', authMiddleware, rating);

// Update a product
router.put('/:id', authMiddleware, isAdmin, updateProduct);

// Delete a product
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;