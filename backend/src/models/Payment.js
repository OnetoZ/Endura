const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true
    },
    razorpayOrderId: {
        type: String,
        required: true,
        index: true
    },
    razorpayPaymentId: {
        type: String,
        required: true,
        index: true
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
        index: true
    },
}, { 
    timestamps: true,
    collection: 'payments' 
});

module.exports = mongoose.model('Payment', paymentSchema);
