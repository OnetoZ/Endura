const Asset = require('../models/Asset');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Fetch all assets
 * @route   GET /api/assets
 * @access  Public
 */
const getAssets = asyncHandler(async (req, res) => {
    const { type, category } = req.query;
    let query = {};
    
    if (type) query.type = { $regex: type, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };

    const assets = await Asset.find(query).sort({ createdAt: -1 }).lean();
    res.json(assets);
});

/**
 * @desc    Fetch single asset
 * @route   GET /api/assets/:id
 * @access  Public
 */
const getAssetById = asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.id).lean();

    if (asset) {
        res.json(asset);
    } else {
        res.status(404);
        throw new Error('Asset not found');
    }
});

/**
 * @desc    Create an asset
 * @route   POST /api/assets
 * @access  Private/Admin
 */
const createAsset = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        originalPrice,
        images,
        type,
        category,
        stock,
        sizes,
        digitalTwinImage,
        shortAtmosphericLine
    } = req.body;

    const asset = new Asset({
        name,
        description,
        price,
        originalPrice: originalPrice || 0,
        images: images || [],
        type: type || 'Common',
        category,
        stock: stock || 0,
        sizes: sizes || { S: 0, M: 0, L: 0, XL: 0 },
        digitalTwinImage,
        shortAtmosphericLine
    });

    const createdAsset = await asset.save();
    res.status(201).json(createdAsset);
});

/**
 * @desc    Update an asset
 * @route   PUT /api/assets/:id
 * @access  Private/Admin
 */
const updateAsset = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        originalPrice,
        images,
        type,
        category,
        stock,
        sizes,
        digitalTwinImage,
        shortAtmosphericLine
    } = req.body;

    const asset = await Asset.findById(req.params.id);

    if (asset) {
        asset.name = name || asset.name;
        asset.description = description || asset.description;
        asset.price = price !== undefined ? price : asset.price;
        asset.originalPrice = originalPrice !== undefined ? originalPrice : asset.originalPrice;
        asset.images = images || asset.images;
        asset.type = type || asset.type;
        asset.category = category || asset.category;
        asset.stock = stock !== undefined ? stock : asset.stock;
        asset.sizes = sizes || asset.sizes;
        asset.digitalTwinImage = digitalTwinImage !== undefined ? digitalTwinImage : asset.digitalTwinImage;
        asset.shortAtmosphericLine = shortAtmosphericLine !== undefined ? shortAtmosphericLine : asset.shortAtmosphericLine;

        const updatedAsset = await asset.save();
        res.json(updatedAsset);
    } else {
        res.status(404);
        throw new Error('Asset not found');
    }
});

/**
 * @desc    Delete an asset
 * @route   DELETE /api/assets/:id
 * @access  Private/Admin
 */
const deleteAsset = asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.id);

    if (asset) {
        await asset.deleteOne();
        res.json({ message: 'Asset removed' });
    } else {
        res.status(404);
        throw new Error('Asset not found');
    }
});

module.exports = {
    getAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset,
};
