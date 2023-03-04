
const { generateToken } = require('../config/jwtToken');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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
        console.log(email, password);

        const findUser = await User.findOne({ email });
        // console.log(findUser.password);
        // console.log(password);
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
                token: generateToken(findUser?._id)
            });
        }
        else {
            throw new Error("Invalid Credentials!")
        }
    }
);

// Get all users
const getAllUsers = asyncHandler(
    async (req, res) => {

        try {
            const users = await User.find({})
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


module.exports = { createUser, loginUser, getAllUsers, getaUser, updateaUser, deleteaUser, blockUser, unblockUser, handleRefreshToken };