const express = require('express');

// imp the controllers
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductCounts,
    getfProducts,

} = require('../../../controllers/product.controller');

// imp model
const Product = require('../../../models/Product.model');
// imp adv middleware
const advancedResults = require('../../../middleware/advancedResults.mw');

// router
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../../../middleware/auth.mw');

const roles = ['superadmin', 'admin'];
const allRoles = ['superadmin', 'admin', 'user'];

router.get('/', advancedResults(Product), getProducts);
router.get('/:id', getProduct);
router.get('/', getProductCounts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.get('/featured', getfProducts);
router.get('/featured/:count', getfProducts);
router.delete('/:id', deleteProduct);

module.exports = router;