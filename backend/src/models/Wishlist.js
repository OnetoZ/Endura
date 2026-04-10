const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    assets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        index: true
    }],
}, { 
    timestamps: true,
    collection: 'wishlists' 
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
