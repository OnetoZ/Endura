const RedemptionCode = require('../models/RedemptionCode');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/vault/codes
 * @desc    Get all redemption codes with optional filters
 * @access  Private/Admin
 */
const getRedemptionCodes = asyncHandler(async (req, res) => {
    const { status, search, batchId } = req.query;
    let query = {};

    if (status === 'redeemed') query.isRedeemed = true;
    if (status === 'available') query.isRedeemed = false;
    if (batchId) query.batchId = Number(batchId);

    if (search) {
        query.code = { $regex: search, $options: 'i' };
    }

    const codes = await RedemptionCode.find(query)
        .populate('redeemedBy', 'username email')
        .sort({ batchId: 1, serialNumber: 1 })
        .lean();

    res.json(codes);
});

/**
 * @route   POST /api/vault/codes/import
 * @desc    Bulk import redemption codes (One-time or replacement)
 * @access  Private/Admin
 */
const importRedemptionCodes = asyncHandler(async (req, res) => {
    const { codes, batchId, frontImage, backImage, type, serialScale, clearBatch } = req.body; 

    if (!Array.isArray(codes) || codes.length === 0) {
        res.status(400);
        throw new Error('Please provide an array of codes to import');
    }

    if (!batchId) {
        res.status(400);
        throw new Error('Batch ID is required for import');
    }

    // Optional: Clear existing codes for this specific batch before re-importing
    if (clearBatch) {
        await RedemptionCode.deleteMany({ batchId: Number(batchId) });
    }

    const results = await Promise.all(codes.map(async (c, index) => {
        return RedemptionCode.findOneAndUpdate(
            { serialNumber: c.serialNumber || (index + 1), batchId: Number(batchId) },
            { 
                code: c.code.trim().toUpperCase(), 
                isRedeemed: false,
                frontImage: frontImage || '/images/default-vault.png',
                backImage: backImage || '/images/default-vault.png',
                type: type || 'Rare',
                serialScale: Number(serialScale) || 100
            },
            { upsert: true, new: true }
        );
    }));

    res.json({
        success: true,
        message: `Successfully synchronized ${results.length} protocols for Batch ${batchId}`,
        count: results.length
    });
});

/**
 * @route   POST /api/vault/redeem-code
 * @desc    Redeem a code for a card collection (User facing)
 * @access  Private
 */
const redeemProvidedCode = asyncHandler(async (req, res) => {
    const { code } = req.body;

    const redemptionCode = await RedemptionCode.findOne({ code: code.toUpperCase().trim() });

    if (!redemptionCode) {
        res.status(404);
        throw new Error('Invalid redemption code. Protocol rejected.');
    }

    if (redemptionCode.isRedeemed) {
        res.status(400);
        throw new Error('This code has already been utilized by another operative.');
    }

    redemptionCode.isRedeemed = true;
    redemptionCode.redeemedBy = req.user._id;
    redemptionCode.redeemedAt = Date.now();
    await redemptionCode.save();

    res.json({
        success: true,
        message: 'Redemption successful. Access granted.',
        protocol: {
            serialNumber: redemptionCode.serialNumber,
            code: redemptionCode.code,
            frontImage: redemptionCode.frontImage,
            backImage: redemptionCode.backImage,
            type: redemptionCode.type,
            batchId: redemptionCode.batchId,
            redeemedAt: redemptionCode.redeemedAt
        }
    });
});

/**
 * @route   PUT /api/vault/codes/bulk-update-image
 * @desc    Apply a specific image to all redemption codes
 * @access  Private/Admin
 */
const bulkUpdateCodeImages = asyncHandler(async (req, res) => {
    const { frontImage, backImage } = req.body;

    if (!frontImage || !backImage) {
        res.status(400);
        throw new Error('Both front and back image references required');
    }

    const result = await RedemptionCode.updateMany({}, { frontImage, backImage });

    res.json({
        success: true,
        message: `Successfully synchronized ${result.modifiedCount} protocols`,
        count: result.modifiedCount
    });
});

/**
 * @route   PUT /api/vault/codes/:id
 * @desc    Update a specific redemption code
 * @access  Private/Admin
 */
const updateRedemptionCode = asyncHandler(async (req, res) => {
    const { code, frontImage, backImage, type, isRedeemed } = req.body;
    const redemptionCode = await RedemptionCode.findById(req.params.id);

    if (redemptionCode) {
        redemptionCode.code = code || redemptionCode.code;
        redemptionCode.frontImage = frontImage || redemptionCode.frontImage;
        redemptionCode.backImage = backImage || redemptionCode.backImage;
        redemptionCode.type = type || redemptionCode.type;
        if (isRedeemed !== undefined) redemptionCode.isRedeemed = isRedeemed;
        
        const updated = await redemptionCode.save();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error('Protocol not found');
    }
});

/**
 * @route   DELETE /api/vault/codes/:id
 * @desc    Delete a specific redemption code
 * @access  Private/Admin
 */
const deleteRedemptionCode = asyncHandler(async (req, res) => {
    const redemptionCode = await RedemptionCode.findById(req.params.id);

    if (redemptionCode) {
        await redemptionCode.deleteOne();
        res.json({ message: 'Protocol purged from archive' });
    } else {
        res.status(404);
        throw new Error('Protocol not found');
    }
});

module.exports = {
    getRedemptionCodes,
    importRedemptionCodes,
    redeemProvidedCode,
    bulkUpdateCodeImages,
    updateRedemptionCode,
    deleteRedemptionCode
};
