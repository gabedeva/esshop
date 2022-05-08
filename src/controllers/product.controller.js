const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async.mw');
const ErrorResponse = require('../utils/errorResponse.util');
const multer = require('multer');   

// model
const Product = require('../models/Product.model');
const Category = require('../models/Category.model');
const { count } = require('../models/Product.model');

//  @desc   Get all products
//  @route  GET /api/eshop/v1/products
//  @route  GET /api/eshop/v1/products?categories=id
//  @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')}
    }
    const product = await Product.find(filter).populate('category');

    if(!product){
        return next(new ErrorResponse('Error', 400, ['cannot get product']))
    }
    res.status(200).json(res.advancedResults).select('name image -_id').populate('category');
    // res.status(200).json(res.advancedResults).populate('category');
});

//  @desc   Get a product
//  @route  GET /api/eshop/v1/products:id
//  @access Public
exports.getProduct = asyncHandler(async(req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category');

    if(!product){
        return next(new ErrorResponse('Error', 404, ['product not found']));
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: product,
        message: 'successful',
        status: 200
    });
});

//  @desc   Create a product
//  @route  POST /api/eshop/v1/products
//  @access Private
exports.createProduct = asyncHandler(async (req, res, next) => {

    const prodExist = await Product.findOne({name: name, description: description})

    if(prodExist){
        return next(new ErrorResponse('Error', 400, ['product with name and description already exist. create a new product name']))
    }
    
    const { 
        name, 
        description,
        richDescription,
        image, 
        brand,
        price,
        category,
        countInStock,
        rating,
        numReviews,
        isFeatured } = req.body;

        if(!category && !mongoose.Types.ObjectId.isValid(category)){
            return next(new ErrorResponse('Invalid category id', 400, ['category id is required to be a valid ObjectId']))
        }

        if(!countInStock && countInStock <=0){
            return next(new ErrorResponse('Invalid count', 400, ['There is no product in stock yet.', 'Number of product cannot be less than or equal to 0']))
        }

    const newProduct = await Product.create({
        name: name,
        description: description,
        richDescription: richDescription,
        image: image,
        brand: brand,
        price: price,
        category: category,
        countInStock: countInStock,
        rating: rating,
        numReviews: numReviews,
        isFeatured: isFeatured
    });
    
    res.status(200).json({
        error: false,
        errors: [],
        data: newProduct,
        message: 'successful',
        status: 200
    });
});

//  @desc   Update a product
//  @route  PUT /api/eshop/v1/products/:id
//  @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product && !mongoose.Types.ObjectId.isValid(product)){
            return next(new ErrorResponse('Invalid product id', 400, ['product id is required to be a valid objectId']));
        }

        const category = await Category.findById(req.params.id);

        if(!category && !mongoose.Types.ObjectId.isValid(category)){
            return next(new ErrorResponse('Invalid category id', 400, ['category id is required to be a valid objectId']));
        }

        // checking to make sure user owns the product
        if(product.name === req.body.name) {
            try{
                // const upProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true, runValidators: true});
                const upProduct = await Product.findByIdAndUpdate(req.params.id,
                     { 
                        name: name,
                        description: description,
                        richDescription: richDescription,
                        image: image,
                        brand: brand,
                        price: price,
                        category: category,
                        countInStock: countInStock,
                        rating: rating,
                        numReviews: numReviews,
                        isFeatured: isFeatured
                      }, 
                      {new: true, runValidators: true});
                res.status(200).json({
                    error: false,
                    errors: [],
                    data: upProduct,
                    message: 'successful',
                    status: 200
                })

            } catch (err) {
                res.status(500).json(err)
            }
        } else {
            res.status(401).json("You are not authorised to update this product. You can only update your product!")
        } 
    } catch(err){
        res.status(500).json(err);
    }
});


//  @desc   Delete a product
//  @route  DELETE /api/eshop/v1/products/:id
//  @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if(product.name === req.body.name) {
            try {
                await product.delete();
                res.status(200).json({
                    data: {}, 
                    message: 'successful'
                })
            } catch (err) {
                res.status(500).json(err)
            }
        } else {
            res.status(401).json("You are not authorised to delete this product. You can only delete product you created")
        }
    } catch(err){
        res.status(500).json(err);
    }
    
});


//  @desc   Get a product count
//  @route  GET /api/eshop/v1/products/count
//  @access Private
exports.getProductCounts = asyncHandler(async(req, res, next) => {
    const productCount = await Product.countDocuments((count) => count);

    if(!productCount){
        return next(new ErrorResponse('Error', 400, ['cannot get product count']));
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: productCount,
        message: 'successful',
        status: 200
    });
});

//  @desc   Get a featured product
//  @route  GET /api/eshop/v1/products/featured
//  @route  GET /api/eshop/v1/products/featured/:count
//  @access Private
exports.getfProducts = asyncHandler(async(req, res, next) => {

    const count = req.params.count ? req.params.count : 0
    const fProducts = await Product.find({ isFeatured: true }).limit(+count);

    if(!fProducts){
        return next(new ErrorResponse('Error', 400, ['cannot get featured products']));
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: fProducts,
        message: 'successful',
        status: 200
    });
});


//  @desc   Like or dislike post
//  @route  PUT /api/eshop/v1/products/:id/like
//  @access Private
exports.likeDislikeProduct = asyncHandler(async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product.likes.includes(req.body.userId)) {
            await product.updateOne({ $push: {likes: req.body.userId} });
            
            res.status(200).json({
                error: false,
                errors: [],
                data: product,
                message: 'The product has been liked',
                status: 200
            });
        } else {
            await Product.updateOne({ $pull: {likes: req.body.userId} });
            res.status(200).json(err)
        }
    } catch (err){
        res.status(500).json(err);
    }
});
