const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, webhook, getPaymentHealth } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Note: webhook should be publicly accessible since razorpay relies on it, 
// usually it might need raw body parsing but since we are using JSON payload from Razorpay, express.json() works if it matches signature.
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', webhook);
router.get('/health', getPaymentHealth);

module.exports = router;
