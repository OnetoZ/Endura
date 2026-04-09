const mongoose = require('mongoose');

const redemptionCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Redemption code is required'],
        unique: true,
        trim: true,
    },
    serialNumber: {
        type: Number,
        required: [true, 'Serial identity is required'],
        min: 1
    },
    serialScale: {
        type: Number,
        default: 100
    },
    batchId: {
        type: Number,
        default: 1, // Batch 1, 2 or 3
    },
    isRedeemed: {
        type: Boolean,
        default: false,
    },
    redeemedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    redeemedAt: {
        type: Date,
        default: null,
    },
    // Which product or card this code is for (optional)
    assignedCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VaultCard',
        default: null,
    },
    frontImage: {
        type: String,
        default: null,
    },
    backImage: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: 'Rare',
    }
}, { timestamps: true });

// Ensure unique serial number within a specific batch
redemptionCodeSchema.index({ serialNumber: 1, batchId: 1 }, { unique: true });

module.exports = mongoose.model('RedemptionCode', redemptionCodeSchema);
