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
        required: [true, 'Serial number is required (1-100)'],
        min: 1,
        max: 100,
        unique: true,
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
    image: {
        type: String,
        default: null,
    }
}, { timestamps: true });

module.exports = mongoose.model('RedemptionCode', redemptionCodeSchema);
