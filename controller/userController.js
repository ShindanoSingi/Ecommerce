const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

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
)

module.exports = { createUser }