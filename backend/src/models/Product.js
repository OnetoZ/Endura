const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
    },
    shortAtmosphericLine: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
    },
    type: {
        type: String,
        enum: ['Worn', 'Refined', 'Exalted', 'Mythic'],
        default: 'Worn',
    },
    category: {
        type: String,
        default: 'Premium Gear',
    },
    // images[0] = front, images[1] = back, images[2] = digitalTwin
    images: [{ type: String }],
    stock: {
        type: Number,
        default: 10,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    digitalTwinMetadata: {
        isIncluded: { type: Boolean, default: true },
        status: { type: String, default: 'Ready for Vault' },
    },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
