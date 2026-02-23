const mongoose = require('mongoose');
const crypto = require('crypto');

const vaultItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productName: { type: String, required: true },
    productImage: { type: String },
    // Unique redemption code generated on creation
    code: {
        type: String,
        default: () => crypto.randomBytes(8).toString('hex').toUpperCase(),
        unique: true,
    },
    isRedeemed: { type: Boolean, default: false },
    redeemedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('VaultItem', vaultItemSchema);
