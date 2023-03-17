
const { generateToken } = require('../config/jwtToken');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel')
const sendEmail = require('./emailController');
const crypto = require('crypto');

const { response } = require('express');
const { find } = require('../models/userModel');

// Create a new user
const createUser = asyncHandler(
    async (req, res) => {
        const userInputs = req.body;
        const findUser = await User.findOne({ email: userInputs.email });

        if (!findUser) {
            const newUser = await User.create(userInputs);
            res.json(newUser);
        } else {
            throw new Error('User Already Exists!')
        }
    }
);

// Login a user
const loginUser = asyncHandler(
    async (req, res) => {
        const { email, password } = req.body;

        const findUser = await User.findOne({ email });
        if (findUser && (await findUser.password === password)) {
            const refreshToken = await generateRefreshToken(findUser?._id);
            const updateuser = await User.findByIdAndUpdate(findUser?._id, {
                refreshToken: refreshToken
            }, { new: true });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            });
            res.json({
                id: findUser?._id,
                firstName: findUser?.firstName,
                lastName: findUser?.lastName,
                email: findUser?.email,
                mobile: findUser?.mobile,
                token: generateToken(findUser?._id),
            });
        }
        else {
            throw new Error("Invalid Credentials!")
        }
    }
);

// Admin login
const loginAdmin = asyncHandler(
    async (req, res) => {
        const { email, password } = req.body;

        // Check if the user Exists
        const findAdmin = await User.findOne({ email });
        if (findAdmin.role !== 'admin') throw new Error("Not Authorized");
        if (findAdmin && (await findAdmin.password === password)) {
            const refreshToken = await generateRefreshToken(findAdmin?._id);
            const updateuser = await User.findByIdAndUpdate(findAdmin?._id, {
                refreshToken: refreshToken
            }, { new: true });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            });
            res.json({
                id: findAdmin?._id,
                firstName: findAdmin?.firstName,
                lastName: findAdmin?.lastName,
                email: findAdmin?.email,
                mobile: findAdmin?.mobile,
                token: generateToken(findAdmin?._id),
            });
        }
        else {
            throw new Error("Invalid Credentials!")
        }
    }
);

// Save user Address
const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        let updateaUser = await User.findById(_id);

        if (!updateaUser) {
            res.json(`User does not exist!`)
        }

        updateaUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        }, { new: true });
        res.json(updateaUser);

    } catch (error) {
        throw new Error(error);
    }
})


// Get all users
const getAllUsers = asyncHandler(
    async (req, res) => {
        try {
            const users = await User.find({});
            res.json(users);
        }
        catch (error) {
            throw new Error(error);
        }
    }
);

// Get a single user
const getaUser = asyncHandler(
    async (req, res) => {
        const { id } = req.params;
        console.log(id);
        validateMongoDbId(id)
        try {
            const getaUser = await User.findById(id);
            res.json(getaUser);
        } catch (error) {
            throw new Error(error);
        }
    }
)

// Refresh a token
const handleRefreshToken = asyncHandler(async (req, res) => {
    console.log(`Below is the cookie:`)
    console.log(process.env.JWT_SECRET);
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error(`No refresh token in cookies`);
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(`No Refresh token found present in db or not matched`);
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error(`There is something wrong with the refresh token`);
        }
        const accessToken = generateToken(user?._id);
        res.json(accessToken);
    });
})

// Update a single user
const updateaUser = asyncHandler(
    async (req, res) => {
        console.log(req)
        const { id } = req.user;
        // console.log(id)
        validateMongoDbId(id)
        const userInputs = req.body;
        try {
            let updateaUser = await User.findById(id);

            if (!updateaUser) {
                res.json(`User does not exist!`)
            }

            updateaUser = await User.findByIdAndUpdate(id, {
                firstName: userInputs?.firstName,
                lastName: userInputs?.lastName,
                email: userInputs?.email,
                mobile: userInputs?.mobile
            }, { new: true });
            res.json(`User updated successfully!`);

        } catch (error) {
            throw new Error(error);
        }
    }
)

// Delete a single user
const deleteaUser = asyncHandler(
    async (req, res) => {
        const { id } = req.params;
        try {
            const deleteaUser = await User.findById(id);

            if (!deleteaUser) {
                res.json(`User does not exist!`)

            }
            res.json(`User deleted successfully!`);
            deleteaUser = await User.findByIdAndDelete(id);


        } catch (error) {
            throw new Error(error.message);
        }
    }
)

// Block user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        let user = await User.findById(id);
        console.log(user);

        if (user) {
            const blockusr = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
            res.json({
                message: `User Blocked!`
            });
        } else {
            res.json({ message: `User does not exist` });
        }

    } catch (error) {
        throw new Error(error);
    }
})

// Unblock user
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        let user = await User.findById(id);
        validateMongoDbId(id)
        if (user) {
            const unblockusr = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
            res.json({
                message: `User Unblocked!`
            });
        } else {
            res.json({ message: `User does not exist` });
        }

    } catch (error) {
        throw new Error(error);
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { password } = req.body;
    validateMongoDbId(id);
    const user = await User.findById(id);

    if (password) {
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    } else {
        res.json(user);
    }
})

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email!")
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from nom. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here for more info.</a>`

        const data = {
            to: email,
            text: "Hey there",
            subject: "Forgot Password Link",
            html: resetURL,
        };
        sendEmail(data);
        res.json(token);


    } catch (err) {
        throw new Error(err)
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHashed('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
})

const getWishlist = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateMongoDbId(id);
    console.log(id)
    try {
        const findUser = await User.findById(id).populate('wishlist');
        res.json(findUser)
    } catch (error) {
        throw new Error(error);
    }
})

const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        let products = [];
        let cartTotal;
        const user = await User.findById(_id).populate("cart");

        // Check  if user already have product in cart.
        const alreadyExistCart = await Cart.findOne({ orderby: user._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
            cartTotal = products.reduce((acc, product) => acc + (product.price * product.count), 0);
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
})

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product");
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
})

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderby: user._id })
        res.json(user)
    } catch (error) {
        throw new Error(error)
    }
})

const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const _id = req.user.id;
    validateMongoDbId(_id);
    console.log(_id);
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon == null) {
        throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    let { products, cartTotal } = await Cart.findOne({ orderby: user._id }).populate("products.product");
    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
    await Cart.findOneAndUpdate({ orderby: user._id }, { totalAfterDiscount }, { new: true });
    res.json(totalAfterDiscount);
})


module.exports = { createUser, loginUser, getAllUsers, getaUser, updateaUser, deleteaUser, blockUser, unblockUser, handleRefreshToken, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon };