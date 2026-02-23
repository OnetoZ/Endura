const Wishlist = require('../models/Wishlist');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = asyncHandler(async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json(wishlist);
});

/**
 * @route   POST /api/wishlist/add
 * @access  Private
 */
const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const alreadyAdded = wishlist.products.includes(productId);
    if (alreadyAdded) {
        return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    const populated = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.status(201).json(populated);
});

/**
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        res.status(404);
        throw new Error('Wishlist not found');
    }

    wishlist.products = wishlist.products.filter(
        p => p.toString() !== req.params.productId
    );

    await wishlist.save();
    const populated = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.json(populated);
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
