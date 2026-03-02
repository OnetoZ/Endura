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
        required: false,
    },
    vaultCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VaultCard',
        required: false,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false,
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
