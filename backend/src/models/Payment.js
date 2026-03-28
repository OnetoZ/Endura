const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    razorpayOrderId: {
        type: String,
        required: true,
    },
    razorpayPaymentId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    method: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'captured', 'failed', 'refunded'],
        default: 'pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
