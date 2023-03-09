const Category = require('../models/prodcatModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDbId');

const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (err) {
        throw new Error(err);
    }
})

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedCategory);
    } catch (err) {
        throw new Error(err);
    }
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    const findCategory = await Category.findById(id);
    try {
        if (!findCategory) {
            res.json({ message: `Product category not found!` })
        }
        const updatedCategory = await Category.findByIdAndDelete(id);
        res.json({ message: `Category deleted successfully!` });
    } catch (err) {
        throw new Error(err);
    }
})

const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    try {
        const getaCategory = await Category.findById(id);
        res.json(getaCategory);
    } catch (err) {
        throw new Error(err);
    }
})

const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const getCategories = await Category.find();
        res.json(getCategories);
    } catch (err) {
        throw new Error(err);
    }
})

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories };