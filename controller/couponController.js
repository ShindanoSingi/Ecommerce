const Coupon = require('../models/couponModel');
const { validateMongoDbId } = require('../utils/validateMongodbId');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error)
    }
});

const getaCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findCoupon = await Coupon.findById(id);
        if (!findCoupon) {
            res.json({ message: 'Coupon not found!' });
        }
        const getaCoupon = await Coupon.findById(id);
        res.json(getaCoupon);
    } catch (error) {
        throw new Error(error)
    }
});

const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        throw new Error(error)
    }
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findCoupon = await Coupon.findById(id);
        if (!findCoupon) {
            res.json({ message: 'Coupon not found!' });
        }
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateCoupon);
    } catch (error) {
        throw new Error(error)
    }
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findCoupon = await Coupon.findById(id);
        if (!findCoupon) {
            res.json({ message: 'Coupon not found!' });
        }
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json({ message: 'Coupon deleted successfully!' });
    } catch (error) {
        throw new Error(error)
    }
});



module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, getaCoupon };