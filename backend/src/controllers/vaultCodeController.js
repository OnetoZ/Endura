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
    const { codes } = req.body; // Expecting array of { serialNumber, code }

    if (!Array.isArray(codes) || codes.length === 0) {
        res.status(400);
        throw new Error('Please provide an array of codes to import');
    }

    // Optional: Clear existing codes before bulk import if user wants a clean set
    // await RedemptionCode.deleteMany({});

    const results = await Promise.all(codes.map(async (c) => {
        return RedemptionCode.findOneAndUpdate(
            { serialNumber: c.serialNumber },
            { code: c.code, isRedeemed: false },
            { upsert: true, new: true }
        );
    }));

    res.json({
        message: `Successfully imported ${results.length} codes`,
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
            image: redemptionCode.image,
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
    const { image } = req.body;

    if (!image) {
        res.status(400);
        throw new Error('Image reference required');
    }

    const result = await RedemptionCode.updateMany({}, { image });

    res.json({
        success: true,
        message: `Successfully synchronized ${result.modifiedCount} protocols`,
        count: result.modifiedCount
    });
});

module.exports = {
    getRedemptionCodes,
    importRedemptionCodes,
    redeemProvidedCode,
    bulkUpdateCodeImages
};
