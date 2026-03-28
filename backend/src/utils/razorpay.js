const Razorpay = require('razorpay');

let razorpayInstance = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } else {
    console.warn('⚠️ Razorpay credentials not found in environment variables. Payments will not work.');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error.message);
}

module.exports = razorpayInstance;
