const express = require('express');

const {
    getUserList,
    getUser,
    createUser
} = require('../../../controllers/user.controller');

// imp the model
const User = require('../../../models/User.model');

const advancedResults = require('../../../middleware/advancedResults.mw');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../../../middleware/auth');

const roles = ['superadmin', 'admin'];
const allRoles = ['superadmin', 'admin', 'user'];

router.get('/', getUserList);
router.get('/:id', getUser);
router.post('/', createUser);