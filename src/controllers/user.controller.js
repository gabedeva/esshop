const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async.mw');
const ErrorResponse = require('../utils/errorResponse.util');
const bcrypt = require('bcryptjs');

// model
const User = require('../models/User.model');

//  @desc   Get all users
//  @route  GET /api/eshop/v1/users
//  @access Public
exports.getUserList = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults).select('-passwordHash');
});

//  @desc   Get a user
//  @route  GET /api/eshop/v1/users/:id
//  @access Private
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    // const user = await User.findById(req.params.id).select('name phone email');

    if (!user) {
        return next(new ErrorResponse('Error', 404, ['user not found']))
    }

    res.status(200).json({
        error: false,
        error: [],
        data: user,
        message: 'successful',
        status: 200
    })
});

//  @desc   create a user
//  route   /api/eshop/user
//  @access Private
exports.createUser = asyncHandler(async (req, res, next) => {

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        color: req.body.color,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });

    user = await user.save();

    if (!user) {
        return next(new ErrorResponse('Error', 400, ['the user cannot be created']))
    }
});


//  @desc   Get a featured product
//  @route  GET /api/eshop/v1/users
//  @route  GET /api/eshop/v1/users/:count
//  @access Private
exports.getUsersCount = asyncHandler(async (req, res, next) => {

    // const count = req.params.count ? req.params.count : 0
    const userCount = await User.countDocuments((count) => count);

    if(!userCount){
        return next(new ErrorResponse('Error', 400, ['cannot get featured products']));
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: userCount,
        message: 'successful',
        status: 200
    });
});
