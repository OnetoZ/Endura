const VaultItem = require('../models/VaultItem');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/vault
 * @access  Private
 */
const getUserVault = asyncHandler(async (req, res) => {
    const items = await VaultItem.find({ user: req.user._id })
        .populate('product', 'name images faction')
        .sort({ createdAt: -1 });

    res.json(items);
});

/**
 * @route   PUT /api/vault/:id/redeem
 * @access  Private
 */
const redeemVaultItem = asyncHandler(async (req, res) => {
    const item = await VaultItem.findById(req.params.id);

    if (!item) {
        res.status(404);
        throw new Error('Vault item not found');
    }

    if (item.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    if (item.isRedeemed) {
        res.status(400);
        throw new Error('This item has already been redeemed');
    }

    item.isRedeemed = true;
    item.redeemedAt = Date.now();
    await item.save();

    res.json({ message: 'Item redeemed successfully', item });
});

/**
 * @route   GET /api/vault/all (admin)
 * @access  Private/Admin
 */
const getAllVaultItems = asyncHandler(async (req, res) => {
    const items = await VaultItem.find({})
        .populate('user', 'username email')
        .populate('product', 'name')
        .sort({ createdAt: -1 });

    res.json(items);
});

module.exports = { getUserVault, redeemVaultItem, getAllVaultItems };
