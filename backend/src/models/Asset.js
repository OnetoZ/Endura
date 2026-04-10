const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    images: [{
        type: String,
    }],
    type: {
        type: String,
        enum: ['Physical', 'Digital Twin', 'Common', 'Rare', 'Epic', 'Legendary', 'digital', 'physical'],
        default: 'Common',
        index: true
    },
    category: {
        type: String,
        index: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    sizes: {
        S: { type: Number, default: 0 },
        M: { type: Number, default: 0 },
        L: { type: Number, default: 0 },
        XL: { type: Number, default: 0 }
    },
    isAvailable: {
        type: Boolean,
        default: true,
        index: true
    },
    digitalTwinImage: {
        type: String
    },
    shortAtmosphericLine: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'assets' // Explicitly setting collection name to 'assets'
});

// Text index for unified search
assetSchema.index({ name: 'text', description: 'text', category: 'text' });
// Compound index for quick catalog filtering
assetSchema.index({ isAvailable: 1, type: 1 });

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;
