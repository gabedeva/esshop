const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async.mw');
const ErrorResponse = require('../middleware/error.mw');

// models
const Order = require('../models/Order.model');
const OrderItem = require('../models/Order-Item.model');
const Product = require('../models/Product.model');

//  @desc   Get all Orders
//  @route  GET /api/eshop/v1/orders
//  @access Public
exports.getOrders = asyncHandler(async (req, res, next) => {
    // const order = await Order.findById(req.params.id).populate('user', 'name').sort({'dateOrdered': -1});
    res.status(200).json(res.advancedResults);
});

//  @desc   Get an Order
//  @route  GET /api/eshop/v1/orders/:id
//  @access Private
exports.getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }});

    if (!order) {
        return next(new ErrorResponse('Error', 404, ['Order does not exist']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: order,
        message: 'successful',
        status: 200
    });
});

//  @desc   Create an Order
//  @route  /api/eshop/v1/orders/create-order
//  @access Public
exports.createOrder = asyncHandler(async (req, res, next) => {

    // first get the order items which is an array, so we use the map function to loop through
    const OrderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }));

    const orderItemsIdsResolved = await OrderItemsIds;

    // calculating the total price
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItem) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    
    const {
        OrderItems,
        shippingAddress1,
        shippingAddress2,
        city,
        zip,
        country,
        phone,
        status,
        totalPrice,
        user
    } = req.body;

    if (!OrderItems && !mongoose.Types.isValid(OrderItems)) {
        return next(new ErrorResponse('Invalid Order id', 400, ['Order id is required to be a valid ObjectId']))
    }

    if (!city) {
        return next(new ErrorResponse('Error', 400, ['city is required']))
    }

    if (!phone) {
        return next(new ErrorResponse('Error', 400, ['phone is required']))
    }

    if (!totalPrice) {
        return next(new ErrorResponse('Error', 400, ['total price is required']))
    }

    // if (totalPrice < 0 || totalPrice > 30) {
    //     return next(new ErrorResponse('Error', 400, ['total price cannot be less than 0 and greater than 30']))
    // }

    const order = await Order.create({
        OrderItems: orderItemsIdsResolved,
        shippingAddress1: shippingAddress1,
        shippingAddress2: shippingAddress2,
        city: city,
        zip: zip,
        country: country,
        phone: phone,
        status: status,
        totalPrice: totalPrice,
        user: user
    });

    res.status(200).json({
        error: false,
        errors: [],
        data: order,
        message: 'successful',
        status: 200
    });

});

//  @desc   Update a category
//  @route  PUT /api/eshop/v1/orders/:id
//  @access Private
exports.updateOrder = asyncHandler(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorResponse('Error', 404, ['cannot find the category']))
    }

    const { status } = req.body;

    // const upOrder = await Order.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true, runValidators: true});
    const upOrder = await Order.findByIdAndUpdate(req.params.id, {status: req.body.status}, {new: true, runValidators: true});

    res.status(200).json({
        error: false,
        errors: [],
        data: upOrder,
        message: 'successfull',
        status: 200
    });
});

//  @desc   Delete a Order
//  @route  DELETE /api/eshop/v1/orders/:id
//  @access Private
exports.deleteOrder = asyncHandler(async(req, res, next) => {
    
    const order = await Order.findById(req.params.id);

    if (!order){
        return next(new ErrorResponse('Error', 404, ['order not found']))
    }

    if (order) {
        await order.orderItems.map(async orderItem => {
            await OrderItem.findByIdAndRemove(orderItem);
        });
    }

    await order.remove();

    res.status(200).json({
        error: false,
        errors: [],
        data: {},
        message: 'successful',
        status: 200
    });
});

//  @desc   Get total sales
//  @route  GET /api/eshop/v1/orders/totalsales
//  @access Private
exports.getTotalSales = asyncHandler(async (req, res, next) => {
    const totalSales = await Order.aggregate([
        {
            $group: { _id: null, totalsales: { $sum: `$totalPrice` } }
        }
    ]);

    if (!totalSales) {
        return next(new ErrorResponse('Error', 400, ['The order sales cannot be generated']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: { totalsales: totalSales.pop().totalsales },
        message: 'successful',
        status: 200
    });
});

//  @desc   Get Orders count
//  @route  GET /api/eshop/v1/orders/getcount
//  @access Private
exports.getOrderCount = asyncHandler(async (req, res, next) => {
    const orderCount = await Order.countDocuments((count) => count);

    if (!orderCount) {
        return next(new ErrorResponse('Error', 404, ['orderCount not found']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: orderCount,
        message: 'successful',
        status: 200
    });
});

//  @desc   Get user Orders
//  @route  GET /api/eshop/v1/orders/user-orders/:id
//  @access
exports.getUserOrders = asyncHandler(async (req, res, next) => {
    const userOrderList = await Order.find({ user: req.params.userid }).populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    }).sort({ 'dateOrdered': -1 });

    if (!userOrderList) {
        return next(new ErrorResponse('Error', 404, ['user order not found']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: userOrderList,
        message: 'successful',
        status: 200
    });
});