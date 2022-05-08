const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async.mw');
const ErrorResponse = require('../utils/errorResponse.util');

// model
const Category = require('../models/Category.model');

//  @desc   Get all categories
//  @route  GET /api/eshop/v1/categories
//  @access Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//  @desc   Get a single category
//  @route  GET /api/eshop/v1/categories/:id
//  @access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category){
        return next(new ErrorResponse('Error', 404, ['category not found']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: category,
        message: 'successful',
        status: 200
    })
});

//  @desc   Create a category
//  @route  POST /api/eshop/v1/categories
//  @access Private
exports.createCategory = asyncHandler(async (req, res, next) => {
    const {name, icon, color} = req.body;

    const category = await Category.create({
        name: name,
        icon: icon,
        color: color
    });

    res.status(200).json({
        error: false,
        errors: [],
        data: category,
        message: 'successful',
        status: 200
    });

});

//  @desc   Update a category
//  @route  PUT /api/eshop/v1/categories/:id
//  @access Private
exports.updateCategory = asyncHandler(async(req, res, next) => {
    const category = await Category.findById(req.params.id);

    if(!category){
        return next(new ErrorResponse('Error', 404, ['cannot find the category']))
    }

    const { name, icon, color } = req.body;

    const upCategory = await Category.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true, runValidators: true});

    res.status(200).json({
        error: false,
        errors: [],
        data: upCategory,
        message: 'successfull',
        status: 200
    });
});

//  @desc   Delete a category
//  @route  DELETE /api/eshop/v1/categories/:id
//  @access Private
exports.deleteCategory = asyncHandler(async(req, res, next) => {
    
    const category = await Category.findById(req.params.id);

    if (!category){
        return next(new ErrorResponse('Error', 404, ['category not found']))
    }

    category.remove();

    res.status(200).json({
        error: false,
        errors: [],
        data: {},
        message: 'successful',
        status: 200
    });
});