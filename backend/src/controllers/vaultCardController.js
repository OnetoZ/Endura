const VaultCard = require('../models/VaultCard');
const VaultItem = require('../models/VaultItem');
const asyncHandler = require('../utils/asyncHandler');
const r2Service = require('../services/r2Service');

/**
 * Helper: delete vault card images from R2 (silently ignores failures)
 */
const deleteCardImages = async (card) => {
    const urls = [card.frontImage, card.backImage].filter(Boolean);
    for (const url of urls) {
        try {
            if (url && url.startsWith('http') && url.includes('r2.dev')) {
                await r2Service.deleteFile(url);
                console.log(`🗑️ R2 deleted: ${url}`);
            }
        } catch (err) {
            console.warn(`⚠️ R2 delete failed (non-blocking): ${url}`, err.message);
        }
    }
};

/**
 * @route   GET /api/vault/cards
 * @access  Public
 */
const getVaultCards = asyncHandler(async (req, res) => {
    const cards = await VaultCard.find({}).sort({ createdAt: -1 }).lean();
    res.json(cards);
});

/**
 * @route   POST /api/vault/cards
 * @access  Private/Admin
 */
const createVaultCard = asyncHandler(async (req, res) => {
    const { name, description, frontImage, backImage, tier, batchDescriptor } = req.body;

    if (!name || !frontImage || !backImage) {
        res.status(400);
        throw new Error('Name (Serial Scale), front image and back image are required');
    }

    // Parse codes from description if available
    let protocolCodes = [];
    if (description) {
        protocolCodes = description.split(/[\n,]+/).map(c => c.replace(/\s/g, '')).filter(c => c.length > 0);
    }

    const card = await VaultCard.create({
        name,
        description,
        frontImage,
        backImage,
        tier: tier || 'common',
        batchDescriptor: batchDescriptor || '',
        codes: protocolCodes,
        createdBy: req.user._id,
    });

    res.status(201).json(card);
});

/**
 * @route   DELETE /api/vault/cards/:id
 * @access  Private/Admin
 */
const deleteVaultCard = asyncHandler(async (req, res) => {
    const card = await VaultCard.findById(req.params.id);
    if (!card) {
        res.status(404);
        throw new Error('Card not found');
    }

    // Delete images from R2
    await deleteCardImages(card);

    // Delete all associated VaultItems (redeemed records)
    const deletedItems = await VaultItem.deleteMany({ vaultCard: card._id });
    console.log(`🗑️ Deleted ${deletedItems.deletedCount} vault items linked to card ${card._id}`);

    await card.deleteOne();
    res.json({ message: 'Card deleted', deletedItemsCount: deletedItems.deletedCount });
});

/**
 * @route   PUT /api/vault/cards/:id
 * @access  Private/Admin
 */
const updateVaultCard = asyncHandler(async (req, res) => {
    const { name, description, frontImage, backImage, tier, batchDescriptor } = req.body;

    const card = await VaultCard.findById(req.params.id);

    if (card) {
        // If images changed, delete the old ones from R2
        if (frontImage && frontImage !== card.frontImage) {
            try {
                if (card.frontImage && card.frontImage.startsWith('http') && card.frontImage.includes('r2.dev')) {
                    await r2Service.deleteFile(card.frontImage);
                    console.log(`🗑️ R2 replaced old front image: ${card.frontImage}`);
                }
            } catch (err) {
                console.warn('⚠️ Old front image R2 delete failed:', err.message);
            }
        }
        if (backImage && backImage !== card.backImage) {
            try {
                if (card.backImage && card.backImage.startsWith('http') && card.backImage.includes('r2.dev')) {
                    await r2Service.deleteFile(card.backImage);
                    console.log(`🗑️ R2 replaced old back image: ${card.backImage}`);
                }
            } catch (err) {
                console.warn('⚠️ Old back image R2 delete failed:', err.message);
            }
        }

        card.name = name || card.name;
        card.description = description !== undefined ? description : card.description;
        card.frontImage = frontImage || card.frontImage;
        card.backImage = backImage || card.backImage;
        card.tier = tier || card.tier;
        card.batchDescriptor = batchDescriptor !== undefined ? batchDescriptor : card.batchDescriptor;

        if (description !== undefined) {
            card.codes = description.split(/[\n,]+/).map(c => c.replace(/\s/g, '')).filter(c => c.length > 0);
        }

        const updatedCard = await card.save();
        res.json(updatedCard);
    } else {
        res.status(404);
        throw new Error('Card not found');
    }
});

module.exports = { getVaultCards, createVaultCard, updateVaultCard, deleteVaultCard };
