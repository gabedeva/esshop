const express = require('express');

// imp routers
const productRoutes = require('./routers/products.router');
const categoryRoutes = require('./routers/categories.router');

// create router
const router = express.Router();

// mount routers with .use
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

// for unmapped routes
router.get('/', (req, res, next) => {

    res.status(200).json({
        status: 'success',
        data: {
            name: 'eshop app',
            version: '0.1.0'
        }
    });
});

module.exports = router;