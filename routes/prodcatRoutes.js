const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories } = require('../controller/prodcatController');

router.post('/', authMiddleware, isAdmin, createCategory);
router.get('/:id', authMiddleware, isAdmin, getCategory);
router.get('/', authMiddleware, isAdmin, getAllCategories);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);


module.exports = router;
