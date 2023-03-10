const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCoupon, updateCoupon, deleteCoupon, getaCoupon, getAllCoupons } = require('../controller/couponController');

router.post('/', authMiddleware, isAdmin, createCoupon);
router.get('/:id', authMiddleware, isAdmin, getaCoupon);
router.get('/', authMiddleware, isAdmin, getAllCoupons);
router.put('/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);


module.exports = router;