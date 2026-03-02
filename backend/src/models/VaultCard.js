const mongoose = require('mongoose');

const vaultCardSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    frontImage: { type: String, required: true },
    backImage: { type: String, required: true },
    category: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    creditValue: {
        type: Number,
        default: 10,
    },
}, { timestamps: true });

module.exports = mongoose.model('VaultCard', vaultCardSchema);
