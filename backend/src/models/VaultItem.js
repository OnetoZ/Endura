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
        index: true
    },
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        index: true
    },
    assetName: { type: String },
    assetImage: { type: String },
    size: { type: String },
    serialNumber: {
        type: Number,
    },
    code: {
        type: String,
        default: () => crypto.randomBytes(8).toString('hex').toUpperCase(),
        unique: true,
        index: true
    },
    isRedeemed: { type: Boolean, default: false, index: true },
    syncCode: { type: String, default: '', index: true },
    redeemedAt: { type: Date },
}, { 
    timestamps: true,
    collection: 'vault_items' 
});

module.exports = mongoose.model('VaultItem', vaultItemSchema);
