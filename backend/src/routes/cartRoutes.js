const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/', clearCart);

module.exports = router;
