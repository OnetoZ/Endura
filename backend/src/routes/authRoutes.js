const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    registerUser,
    loginUser,
    logoutUser,
    googleCallback,
    verifyGoogleTwoFactor,
    getUserProfile,
    updateUserProfile,
    changePassword,
    addAddress,
    setDefaultAddress,
    deleteAddress,
    checkAdminEmail,
    verifyAdminTwoFactor,
    resendAdminTwoFactor,
    toggleTwoFactor,
    sendTestTwoFactorCode,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, adminCheckValidation } = require('../middleware/validate');

// ── Public ──────────────────────────────────────────────
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/admin-check', adminCheckValidation, checkAdminEmail);
router.post('/admin-verify-2fa', verifyAdminTwoFactor);
router.post('/admin-resend-2fa', resendAdminTwoFactor);
router.post('/google-verify-2fa', verifyGoogleTwoFactor);

// ── Private ──────────────────────────────────────────────
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

// ── 2FA Management ─────────────────────────────────────────
router.post('/toggle-2fa', protect, toggleTwoFactor);
router.post('/send-test-2fa', protect, sendTestTwoFactorCode);

// ── Addresses ────────────────────────────────────────────
router.post('/address', protect, addAddress);
router.put('/address/:id/default', protect, setDefaultAddress);
router.delete('/address/:id', protect, deleteAddress);

// ── Google OAuth ─────────────────────────────────────────
// Step 1: Redirect to Google (optionally with login_hint to skip account picker)
router.get('/google', (req, res, next) => {
    const options = { scope: ['profile', 'email'] };
    const stateObj = {};

    if (req.query.login_hint) {
        options.login_hint = req.query.login_hint;
        // Persist the expected admin email so the callback can enforce it
        req.session.expectedAdminEmail = req.query.login_hint;
        stateObj.expectedAdminEmail = req.query.login_hint;
    } else {
        // Regular user OAuth — clear any stale admin expectation
        delete req.session.expectedAdminEmail;
    }

    if (req.query.source === 'admin') {
        stateObj.source = 'admin';
    }

    // Capture requester origin for dynamic callback redirect (failsafe)
    stateObj.origin = req.query.origin || req.headers.referer?.split('?')[0].replace(/\/$/, '');

    if (Object.keys(stateObj).length > 0) {
        options.state = Buffer.from(JSON.stringify(stateObj)).toString('base64');
    }

    if (req.query.login_hint) {
        // Ensure the session is saved to the store before redirecting to Google
        return req.session.save((err) => {
            if (err) return next(err);
            passport.authenticate('google', options)(req, res, next);
        });
    }
    passport.authenticate('google', options)(req, res, next);
});
// Step 2: Google redirects back here
router.get('/google/callback',
    passport.authenticate('google', { session: true, failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth?error=oauth_failed` }),
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
