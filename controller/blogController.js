const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (err) {
        throw new Error(err)
    }
})

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const findBlog = Blog.findById(id)
    if (!findBlog) {
        res.json(`Blog not found!`)
    }
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updateBlog);
    } catch (err) {
        throw new Error(err)
    }
})

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const findBlog = Blog.findById(id)
    if (!findBlog) {
        res.json(`Blog not found!`)
    }
    try {
        const getBlog = await Blog.findById(id);
        const updateViews = await Blog.findByIdAndUpdate(id, {
            $inc: { numViews: 1 }
        },
            { new: true }
        );
        res.json(updateViews);
    } catch (err) {
        throw new Error(err)
    }
})

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (err) {
        throw new Error(err);
    }
})
module.exports = { createBlog, updateBlog, getBlog, getAllBlogs }