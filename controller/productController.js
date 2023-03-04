const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slug = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
    try {
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error);
    }
})

const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        if (!findProduct) {
            res.json({ message: `The product does not exist` })
        }
        res.json(findProduct)
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const getAllProducts = await Product.find();
        if (!getAllProducts) {
            res.json({ message: `The are no products!` })
        }
        res.json(getAllProducts);
    } catch (error) {
        throw new Error(error);
    }
})






module.exports = { createProduct, getaProduct, getAllProducts }