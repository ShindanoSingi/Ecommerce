const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlog, updateBlog, getBlog } = require('../controller/blogController');

router.post('/', authMiddleware, isAdmin, createBlog);
router.get('/:id', authMiddleware, isAdmin, getBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);


module.exports = router;