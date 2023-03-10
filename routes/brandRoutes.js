const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrands } = require('../controller/brandController');

router.post('/', authMiddleware, isAdmin, createBrand);
router.get('/:id', authMiddleware, isAdmin, getBrand);
router.get('/', authMiddleware, isAdmin, getAllBrands);
router.put('/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);


module.exports = router;
