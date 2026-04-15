const VaultItem = require('../models/VaultItem');
const VaultCard = require('../models/VaultCard');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/vault
 * @access  Private
 */
const getUserVault = asyncHandler(async (req, res) => {
    // 1. Get User's Collectibles
    const allItems = await VaultItem.find({ user: req.user._id })
        .populate('vaultCard', 'name frontImage backImage tier codes')
        .lean();

    // 2. Filter out junk/placeholder entries
    const items = allItems.filter(item =>
        item.vaultCard &&
        item.vaultCard.name &&
        item.vaultCard.name !== 'Protocol Sync'
    );

    res.json({
        protocols: items
    });
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
 * @desc    Collect a vault card, update credits
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
        // Already collected
        return res.json({
            success: true,
            oldScore: user.credits,
            newScore: user.credits,
            creditDelta: 0,
            alreadyCollected: true,
            vaultItem: existingCollection
        });
    }

    // Increment vaultCard mint count
    card.totalMinted += 1;
    await card.save();

    // Add to user archive
    const vaultItem = await VaultItem.create({
        user: req.user._id,
        vaultCard: card._id,
        serialNumber: card.totalMinted
    });

    // Increase credit score
    const oldScore = user.credits || 0;
    const creditDelta = 10; // Base credit value
    const newScore = oldScore + creditDelta;

    user.credits = newScore;
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
        .populate('vaultCard', 'name category tier codes')
        .sort({ createdAt: -1 })
        .lean();

    res.json(items);
});

/**
 * @route   DELETE /api/vault/item/:id (admin)
 * @access  Private/Admin
 */
const deleteVaultItemAdmin = asyncHandler(async (req, res) => {
    const item = await VaultItem.findById(req.params.id);
    if (!item) {
        res.status(404);
        throw new Error('Vault item not found');
    }
    await item.deleteOne();
    res.json({ message: 'Vault item deleted successfully' });
});

/**
 * @route   PUT /api/vault/item/:id (admin)
 * @access  Private/Admin
 */
const updateVaultItemAdmin = asyncHandler(async (req, res) => {
    const item = await VaultItem.findById(req.params.id);
    if (!item) {
        res.status(404);
        throw new Error('Vault item not found');
    }

    if (req.body.isRedeemed !== undefined) {
        item.isRedeemed = req.body.isRedeemed;
        if (req.body.isRedeemed && !item.redeemedAt) {
            item.redeemedAt = Date.now();
        }
    }

    await item.save();

    const updatedItem = await VaultItem.findById(req.params.id)
        .populate('user', 'username email')
        .populate('vaultCard', 'name category tier')
        .lean();

    res.json(updatedItem);
});

/**
 * @route   POST /api/vault/sync
 * @desc    Sync a vault card using a secret code
 * @access  Private
 */
const syncVaultCardByCode = asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400);
        throw new Error('Sync code is required');
    }

    // Find the VaultCard that contains this code
    const sanitizedCode = code.replace(/\s/g, '');
    const card = await VaultCard.findOne({
        $or: [
            { codes: sanitizedCode },
            { description: { $regex: sanitizedCode, $options: 'i' } }
        ],
        isActive: { $ne: false }
    });

    if (!card) {
        res.status(404);
        throw new Error('Invalid Decryption Protocol');
    }

    const user = await User.findById(req.user._id);

    // Check if THIS SPECIFIC CODE has already been redeemed by ANY user
    const existingCodeUsage = await VaultItem.findOne({
        vaultCard: card._id,
        syncCode: sanitizedCode
    }).populate('vaultCard', 'name frontImage backImage tier codes description batchId');

    if (existingCodeUsage) {
        // Code already used
        if (existingCodeUsage.user.toString() === req.user._id.toString()) {
            // Same user re-entering their own code
            return res.json({
                success: true,
                message: 'Protocol re-synchronized',
                oldScore: user.credits,
                newScore: user.credits,
                creditDelta: 0,
                vaultItem: existingCodeUsage
            });
        } else {
            // Different user trying to use an already-used code
            res.status(400);
            throw new Error('This protocol code has already been claimed');
        }
    }

    // Check if user already collected this card via a DIFFERENT code
    const existingUserCollection = await VaultItem.findOne({
        user: req.user._id,
        vaultCard: card._id
    }).populate('vaultCard', 'name frontImage backImage tier codes description batchId');

    if (existingUserCollection) {
        return res.json({
            success: true,
            message: 'Protocol re-synchronized',
            oldScore: user.credits,
            newScore: user.credits,
            creditDelta: 0,
            vaultItem: existingUserCollection
        });
    }

    // Increment vaultCard mint count
    card.totalMinted += 1;
    await card.save();

    // Calculate the code's position in the card's codes array (1-based)
    const codeIndex = card.codes.indexOf(sanitizedCode);
    const codePosition = codeIndex >= 0 ? codeIndex + 1 : card.totalMinted;

    // Add to user archive with the specific sync code
    const vaultItem = await VaultItem.create({
        user: req.user._id,
        vaultCard: card._id,
        serialNumber: codePosition,
        syncCode: sanitizedCode,
        isRedeemed: true,
        redeemedAt: Date.now()
    });

    // Increase credit score
    const oldScore = user.credits || 0;
    const creditDelta = 10;
    const newScore = oldScore + creditDelta;

    user.credits = newScore;
    user.creditHistory.push({
        delta: creditDelta,
        reason: `Synchronized ${card.name} (${card.batchDescriptor})`,
        timestamp: Date.now()
    });

    await user.save();

    res.json({
        success: true,
        oldScore,
        newScore,
        creditDelta,
        vaultItem: await VaultItem.findById(vaultItem._id).populate('vaultCard', 'name frontImage backImage tier codes')
    });
});

module.exports = { getUserVault, redeemVaultItem, getAllVaultItems, collectVaultCard, deleteVaultItemAdmin, updateVaultItemAdmin, syncVaultCardByCode };
