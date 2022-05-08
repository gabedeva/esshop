const express = require('express');

const {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../../../controllers/order.controller');

// router
const router = express.Router({ mergeParams: true });

// model
const Order = require('../../../models/Order.model');
const advancedResults = require('../../../middleware/advancedResults.mw');

const { protect, authorize } = require('../../../middleware/auth.mw');

const roles = ['superadmin', 'admin'];
const allRoles = ['superadmin', 'admin', 'user'];

router.get('/', advancedResults(Order), getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);