const express = require('express');

// imp controllers
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../../../controllers/category.controller');

// router
const router = express.Router();

// imp model & adv middleware
const Category = require('../../../models/Category.model');

const advancedResults = require('../../../middleware/advancedResults.mw');

const { protect, authorize } = require('../../../middleware/auth.mw');

// roles
const roles = ['superadmin', 'admin'];
const allRoles = ['superadmin', 'admin', 'user'];

router.get('/', advancedResults(Category), getCategories);
router.get('/:id', getCategory);
router.post('/', protect, authorize(allRoles), createCategory);
router.put('/:id', protect, authorize(allRoles), updateCategory);
router.delete('/:id', protect, authorize(roles), deleteCategory);