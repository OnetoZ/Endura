const mongoose = require('mongoose');
const crypto = require('crypto');

const vaultItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    vaultCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VaultCard',
        required: true,
        index: true
    },
    serialNumber: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        default: () => crypto.randomBytes(8).toString('hex').toUpperCase(),
        unique: true,
        index: true
    },
    isRedeemed: { type: Boolean, default: false, index: true },
    redeemedAt: { type: Date },
}, { 
    timestamps: true,
    collection: 'vault_items' 
});

module.exports = mongoose.model('VaultItem', vaultItemSchema);
