const mongoose = require('mongoose');

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
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative'],
    },
    faction: {
        type: String,
        enum: ['Core', 'Expanse', 'Sentinel', 'Void'], // Example factions for ENDURA theme
        default: 'Core',
    },
    images: [{
        type: String,
        required: [true, 'At least one image URL is required'],
    }],
    category: {
        type: String,
        default: 'Premium Gear',
    },
    stock: {
        type: Number,
        default: 10,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    digitalTwinMetadata: {
        type: Object,
        default: {
            isIncluded: true,
            status: 'Ready for Vault',
        },
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
