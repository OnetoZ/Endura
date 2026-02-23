const { body, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
        });
    }
    next();
};

// Auth Validations
const registerValidation = [
    body('username').notEmpty().withMessage('Username is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 10, max: 20 }).withMessage('Phone must be 10-20 characters'),
    validate
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

// Product Validations
const productValidation = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('description').notEmpty().withMessage('Description is required'),
    body('faction').isIn(['Core', 'Expanse', 'Sentinel', 'Void']).withMessage('Invalid faction'),
    validate
];

// Order Validations
const orderValidation = [
    body('orderItems').isArray({ min: 1 }).withMessage('Order items cannot be empty'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    productValidation,
    orderValidation
};
