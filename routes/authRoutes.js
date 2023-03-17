const express = require('express');
const { createUser, loginUser, getAllUsers, getaUser, updateaUser, deleteaUser, blockUser, unblockUser, handleRefreshToken, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.post('/reset-password/:token', resetPassword);
router.post('/cart/applycoupon', authMiddleware, applyCoupon);
router.post('/cart/cash-order', authMiddleware, createOrder);

router.put('/password', authMiddleware, updatePassword);

router.post('/login', loginUser);
router.post('/cart', authMiddleware, userCart);
router.post('/admin-login', loginAdmin);

router.get('/users', getAllUsers);
router.get('/refresh', handleRefreshToken);
router.get('/wishlist', authMiddleware, getWishlist);
router.get('/cart', authMiddleware, getUserCart);
router.get('/empty-cart', authMiddleware, emptyCart);
router.get('/:id', authMiddleware, isAdmin, getaUser);

router.put('/save-address', authMiddleware, saveAddress);
router.put('/edit-user', authMiddleware, updateaUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);
router.delete('/:id', deleteaUser);

module.exports = router;