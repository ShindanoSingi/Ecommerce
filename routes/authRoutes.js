const express = require('express');
const { createUser, loginUser, getAllUsers, getaUser, updateaUser, deleteaUser, blockUser, unblockUser, handleRefreshToken, updatePassword, forgotPasswordToken, resetPassword } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.post('/reset-password/:token', resetPassword);
router.put('/password', authMiddleware, updatePassword);
router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.get('/refresh', handleRefreshToken);
router.get('/:id', authMiddleware, isAdmin, getaUser);
router.put('/edit-user', authMiddleware, updateaUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);
router.delete('/:id', deleteaUser);

module.exports = router;