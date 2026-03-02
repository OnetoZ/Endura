const VaultItem = require('../models/VaultItem');
const VaultCard = require('../models/VaultCard');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/vault
 * @access  Private
 */
const getUserVault = asyncHandler(async (req, res) => {
    const items = await VaultItem.find({ user: req.user._id })
        .populate('product', 'name images type')
        .populate('vaultCard', 'name frontImage category')
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
 * @route   POST /api/vault/:id/collect
 * @desc    Collect a vault card, update credit score. Returns existing if already collected.
 * @access  Private
 */
const collectVaultCard = asyncHandler(async (req, res) => {
    const card = await VaultCard.findById(req.params.id);

    if (!card) {
        res.status(404);
        throw new Error('Vault Card not found');
    }

    const user = await User.findById(req.user._id);

    // Check if user already collected this
    const existingCollection = await VaultItem.findOne({
        user: req.user._id,
        vaultCard: card._id
    });

    if (existingCollection) {
        // Already collected, just return success and current score to avoid 400 error
        return res.json({
            success: true,
            oldScore: user.creditScore,
            newScore: user.creditScore,
            creditDelta: 0,
            alreadyCollected: true,
            vaultItem: existingCollection
        });
    }

    // Add to user archive
    const vaultItem = await VaultItem.create({
        user: req.user._id,
        vaultCard: card._id,
        productName: card.name,
        productImage: card.frontImage
    });

    // Increase credit score
    const oldScore = user.creditScore || 0;
    const creditDelta = card.creditValue || 10;
    const newScore = oldScore + creditDelta;

    user.creditScore = newScore;
    user.creditHistory.push({
        delta: creditDelta,
        reason: `Collected ${card.name}`,
        timestamp: Date.now()
    });

    await user.save();

    res.json({
        success: true,
        oldScore,
        newScore,
        creditDelta,
        vaultItem
    });
});

/**
 * @route   GET /api/vault/all (admin)
 * @access  Private/Admin
 */
const getAllVaultItems = asyncHandler(async (req, res) => {
    const items = await VaultItem.find({})
        .populate('user', 'username email')
        .populate('product', 'name')
        .populate('vaultCard', 'name')
        .sort({ createdAt: -1 });

    res.json(items);
});

module.exports = { getUserVault, redeemVaultItem, getAllVaultItems, collectVaultCard };
