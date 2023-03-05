const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedProduct)
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const findProduct = await Product.findByIdAndUpdate(id);

    if (!findProduct) {
        res.json({
            message: 'Product not found!'
        });
    }

    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(
            { message: 'Product deleted successfully!' })
    } catch (error) {
        throw new Error(error);
    }
});

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






module.exports = { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct }