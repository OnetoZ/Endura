const Coupon = require('../models/Coupon');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all coupons
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
});

/**
 * @desc    Create a coupon
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountAmount, quantity, expiryDate } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

    if (couponExists) {
        res.status(400);
        throw new Error('Coupon code already exists');
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discountAmount,
        quantity,
        expiryDate
    });

    res.status(201).json(coupon);
});

/**
 * @desc    Delete a coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await coupon.deleteOne();
        res.json({ message: 'Coupon removed' });
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

/**
 * @desc    Validate a coupon code
 * @route   POST /api/coupons/validate
 * @access  Public
 */
const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
        res.status(404);
        throw new Error('Invalid coupon code');
    }

    if (coupon.usedCount >= coupon.quantity) {
        res.status(400);
        throw new Error('Coupon limit reached');
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        res.status(400);
        throw new Error('Coupon has expired');
    }

    res.json({
        code: coupon.code,
        discountAmount: coupon.discountAmount
    });
});

/**
 * @desc    Update a coupon
 * @route   PUT /api/coupons/:id
 * @access  Private/Admin
 */
const updateCoupon = asyncHandler(async (req, res) => {
    const { code, discountAmount, quantity, expiryDate, isActive } = req.body;
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        coupon.code = code ? code.toUpperCase() : coupon.code;
        coupon.discountAmount = discountAmount || coupon.discountAmount;
        coupon.quantity = quantity || coupon.quantity;
        coupon.expiryDate = expiryDate || coupon.expiryDate;
        if (isActive !== undefined) coupon.isActive = isActive;

        const updatedCoupon = await coupon.save();
        res.json(updatedCoupon);
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

module.exports = {
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
};
