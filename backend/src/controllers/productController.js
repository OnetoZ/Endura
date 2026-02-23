const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// ─── Get All Products ─────────────────────────────────────────────────────────

/**
 * @route   GET /api/products
 * @access  Public
 * Query params: ?faction=Core&search=alpha&page=1&limit=12&category=gear
 */
const getProducts = asyncHandler(async (req, res) => {
    const { faction, search, category, page = 1, limit = 12 } = req.query;

    const filter = { isActive: true };

    if (faction) filter.faction = faction;
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    res.json({
        products,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
    });
});

// ─── Get Product by ID ────────────────────────────────────────────────────────

/**
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.json(product);
});

// ─── Create Product ───────────────────────────────────────────────────────────

/**
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, faction, images, category, stock, shortAtmosphericLine, digitalTwinMetadata } = req.body;

    const product = await Product.create({
        name,
        price,
        description,
        faction,
        images: images || [],
        category,
        stock,
        shortAtmosphericLine,
        digitalTwinMetadata,
    });

    res.status(201).json(product);
});

// ─── Update Product ───────────────────────────────────────────────────────────

/**
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const fields = ['name', 'price', 'description', 'faction', 'images', 'category', 'stock', 'isActive', 'shortAtmosphericLine', 'digitalTwinMetadata'];
    fields.forEach(f => {
        if (req.body[f] !== undefined) product[f] = req.body[f];
    });

    const updated = await product.save();
    res.json(updated);
});

// ─── Delete Product ───────────────────────────────────────────────────────────

/**
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product deleted successfully' });
});

// ─── Create Review ────────────────────────────────────────────────────────────

/**
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Check if already reviewed
    const alreadyReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
        res.status(400);
        throw new Error('You have already reviewed this product');
    }

    product.reviews.push({
        user: req.user._id,
        username: req.user.username,
        rating: Number(rating),
        comment,
    });

    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
};
