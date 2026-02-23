const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    registerUser,
    loginUser,
    googleCallback,
    getUserProfile,
    updateUserProfile,
    changePassword,
    addAddress,
    setDefaultAddress,
    deleteAddress,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validate');

// ── Public ──────────────────────────────────────────────
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

// ── Google OAuth ─────────────────────────────────────────
// Step 1: Redirect to Google
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
// Step 2: Google redirects back here
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/auth?error=oauth_failed` }),
    googleCallback
);

// ── Private ──────────────────────────────────────────────
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

// ── Addresses ────────────────────────────────────────────
router.post('/address', protect, addAddress);
router.put('/address/:id/default', protect, setDefaultAddress);
router.delete('/address/:id', protect, deleteAddress);

module.exports = router;
