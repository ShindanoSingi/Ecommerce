const express = require('express');
const { createUser, loginUser, getAllUsers, getaUser, updateaUser, deleteaUser } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.get('/:id', authMiddleware, isAdmin, getaUser);
router.put('/edit-user', authMiddleware, updateaUser);
router.put('/block-user/:id', authMiddleware, updateaUser);
router.delete('/:id', deleteaUser);

module.exports = router;