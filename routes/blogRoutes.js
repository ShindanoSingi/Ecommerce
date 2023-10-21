const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, disLikeBlog, uploadImages } = require('../controller/blogController');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');

router.post('/', authMiddleware, isAdmin, createBlog);
router.get('/', authMiddleware, isAdmin, getAllBlogs);
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array("images", 10), blogImgResize, uploadImages);
router.put('/likes', authMiddleware, isAdmin, likeBlog);
router.put('/dislikes', authMiddleware, isAdmin, disLikeBlog);
router.get('/:id', authMiddleware, isAdmin, getBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);

router.delete('/:id', authMiddleware, isAdmin, deleteBlog);


module.exports = router;