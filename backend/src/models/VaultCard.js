const mongoose = require('mongoose');

const vaultCardSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    frontImage: { type: String, required: true },
    backImage: { type: String, required: true },
    category: {
        type: String,
        enum: ['Silver', 'Gold', 'Diamond', 'Legendary'],
        default: 'Gold',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

module.exports = mongoose.model('VaultCard', vaultCardSchema);
