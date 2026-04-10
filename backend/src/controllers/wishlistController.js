const Wishlist = require('../models/Wishlist');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = asyncHandler(async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('assets');

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user._id, assets: [] });
    }

    res.json(wishlist);
});

/**
 * @route   POST /api/wishlist/add
 * @access  Private
 */
const addToWishlist = asyncHandler(async (req, res) => {
    const { assetId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        wishlist = new Wishlist({ user: req.user._id, assets: [] });
    }

    const alreadyAdded = wishlist.assets.includes(assetId);
    if (alreadyAdded) {
        return res.status(400).json({ message: 'Asset already in wishlist' });
    }

    wishlist.assets.push(assetId);
    await wishlist.save();

    const populated = await Wishlist.findOne({ user: req.user._id }).populate('assets');
    res.status(201).json(populated);
});

/**
 * @route   DELETE /api/wishlist/:assetId
 * @access  Private
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        res.status(404);
        throw new Error('Wishlist not found');
    }

    wishlist.assets = wishlist.assets.filter(
        p => p.toString() !== req.params.assetId
    );

    await wishlist.save();
    const populated = await Wishlist.findOne({ user: req.user._id }).populate('assets');
    res.json(populated);
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
