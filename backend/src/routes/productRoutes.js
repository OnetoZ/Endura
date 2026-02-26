const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const { productValidation } = require('../middleware/validate');

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Private — add a review
router.post('/:id/reviews', protect, createProductReview);

// Admin only
router.post('/', protect, admin, productValidation, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
