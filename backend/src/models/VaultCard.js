const mongoose = require('mongoose');

const vaultCardSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: '' },
    frontImage: { type: String, required: true },
    backImage: { type: String, required: true },
    tier: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common',
        index: true
    },
    batchDescriptor: { type: String, default: '' },
    codes: { type: [String], default: [] },
    isActive: { type: Boolean, default: true, index: true },
    totalMinted: { type: Number, default: 0 }
}, { 
    timestamps: true,
    collection: 'vault_cards' 
});

module.exports = mongoose.model('VaultCard', vaultCardSchema);
