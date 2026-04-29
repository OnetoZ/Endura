const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    items: [{
        asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Asset',
            required: true,
            index: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        size: {
            type: String,
            default: 'M'
        },
    }],
}, { 
    timestamps: true,
    collection: 'carts' 
});

module.exports = mongoose.model('Cart', cartSchema);
