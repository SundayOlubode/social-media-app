const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("express-async-errors");

const logger = require("../utils/logger");
const db = require("../models");
const AppError = require("../utils/appError");

// User model
const User = db.users;

//CREATE FUNCTION THAT HANDLES TOKEN RESPONSE & COOKIE RESPONSE
const createSendToken = async (user, statusCode, res) => {
    // create jwt token with model instance
    const token = await user.createJwt();
    const cookieOptions = {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    // Send token to client
    res.cookie("jwt", token, cookieOptions);

    res.status(statusCode).json({
        status: "Success",
        data: {
            user,
            token,
        },
    });
};

const signup = async (req, res) => {

    const { username, email, password, displayName } = req.body;

    // // validate input
    if (!(username && email && password && displayName))
        throw new AppError("All fields are required", 400);

    //check if user already exist
    const oldUser = await User.findOne({
        where: { email: email },
    });

    if (oldUser) throw new AppError("User already exists. Please login", 409);

    // if new user create
    const user = await User.create(req.body);

    //CREATE TOKEN
    createSendToken(user, 200, res);
};

const login = async (req, res) => {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) throw new AppError("All fields are required", 400);

    // Validate if user exist in database
    const user = await User.findOne({
        where: { email: email },
    });

    // // check if user exist
    // if (!user) throw new AppError("Wrong email ", 400);

    // //compare hashed password using model instance
    // const isValid = await user.comparePassword(password);
    // if (!isValid) throw new AppError("password is incorrect try again ", 400);

    // Check if user exists and email exist without leaking extra info
    if (!user || !(await user.comparePassword(password)))
        throw new AppError("Email Or Password Incorrect", 400);

    //CREATE TOKEN
    createSendToken(user, 200, res);
};

// SOCIAL SIGNUP OR LOGIN
const checkOrCreateOAuthUser = async (socialUser) => {

    // Validate user input
    if (!socialUser) throw new AppError("User credentials are required!", 400);

    //check if user already exists
    const oldUser = await User.findOne({
        where: { socialId: socialUser.socialId },
    });

    //Create user if new
    if (!oldUser) {
        const user = await User.create({...socialUser});
        if(!user) throw new AppError('Falied to create social user', 500)
    }

    return
};

const profile = (req, res) => {
    res.render('profile')
}

// TO DO
// reset password
// forgot password
// logout?

module.exports = {
    signup,
    login,
    profile,
    checkOrCreateOAuthUser,
    createSendToken
};
