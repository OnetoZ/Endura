const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.use(protect); // All wishlist routes require authentication

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/:assetId', removeFromWishlist);

module.exports = router;
