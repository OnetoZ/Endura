const Razorpay = require('razorpay');
const missingEnvVars = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']
  .filter((key) => !process.env[key] || process.env[key].trim().length === 0);

if (missingEnvVars.length > 0) {
  throw new Error(
    `[Razorpay] Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log('[Razorpay] Instance initialized successfully');

module.exports = {
  razorpayInstance,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
};
