const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true,
        index: true
    },
    name: { type: String, required: true },
    image: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    size: { type: String },
    editionNumber: { type: Number },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String },
    },
    paymentMethod: {
        type: String,
        default: 'ONLINE',
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        updateTime: { type: String },
        emailAddress: { type: String },
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    trackingId: { type: String },
    
    // Razorpay Integration Fields
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String, index: true },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
        index: true
    },
    
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
        index: true
    },
}, { 
    timestamps: true,
    collection: 'orders'
});

// Indexes to speed up queries
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
