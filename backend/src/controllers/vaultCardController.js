const VaultCard = require('../models/VaultCard');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/vault/cards
 * @access  Public
 */
const getVaultCards = asyncHandler(async (req, res) => {
    const cards = await VaultCard.find({}).sort({ createdAt: -1 });
    res.json(cards);
});

/**
 * @route   POST /api/vault/cards
 * @access  Private/Admin
 */
const createVaultCard = asyncHandler(async (req, res) => {
    const { name, description, frontImage, backImage, category } = req.body;

    if (!name || !frontImage || !backImage) {
        res.status(400);
        throw new Error('Name, front image and back image are required');
    }

    const card = await VaultCard.create({
        name,
        description,
        frontImage,
        backImage,
        category: category || 'Gold',
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
    await card.deleteOne();
    res.json({ message: 'Card deleted' });
});

/**
 * @route   PUT /api/vault/cards/:id
 * @access  Private/Admin
 */
const updateVaultCard = asyncHandler(async (req, res) => {
    const { name, description, frontImage, backImage, category } = req.body;

    const card = await VaultCard.findById(req.params.id);

    if (card) {
        card.name = name || card.name;
        card.description = description !== undefined ? description : card.description;
        card.frontImage = frontImage || card.frontImage;
        card.backImage = backImage || card.backImage;
        card.category = category || card.category;

        const updatedCard = await card.save();
        res.json(updatedCard);
    } else {
        res.status(404);
        throw new Error('Card not found');
    }
});

module.exports = { getVaultCards, createVaultCard, updateVaultCard, deleteVaultCard };
