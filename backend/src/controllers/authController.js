const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const {
    generateAndStoreTwoFactorCode,
    verifyTwoFactorCode,
    clearTwoFactorCode
} = require('../services/twoFactorService');

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const userResponse = (user) => ({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    isVerified: user.isVerified,
    addresses: user.addresses,
    credits: user.credits,
    creditScore: user.creditScore,
    token: generateToken(user._id),
});

// ─── Register ────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists with this email');
    }

    const user = await User.create({ username, email, password, phone, isVerified: true });
    res.status(201).json(userResponse(user));
});

// ─── Admin Email Check ───────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/admin-check
 * @access  Public
 */
const checkAdminEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    console.log('🔍 Admin email check:', email);

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
        res.status(401);
        throw new Error('ACCESS_DENIED: You are not an admin');
    }

    // Just confirm the email is an admin — Google OAuth comes NEXT, THEN 2FA
    console.log('✅ Admin confirmed:', email);
    res.json({
        verified: true,
        message: 'Admin email verified. Proceed to Google sign-in.',
        email: admin.email,
    });
});

// ─── Admin 2FA Verification ─────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/admin-verify-2fa
 * @access  Public
 */
const verifyAdminTwoFactor = asyncHandler(async (req, res) => {
    const { tempToken, twoFactorCode } = req.body;

    // Decode the temp token issued after Google OAuth
    let decoded;
    try {
        decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
        res.status(401);
        throw new Error('Session expired. Please start the login process again.');
    }

    if (!decoded.adminAuth || !decoded.temp) {
        res.status(401);
        throw new Error('Invalid session token');
    }

    const admin = await User.findById(decoded.id)
        .select('+twoFactorCode +twoFactorCodeExpires');
    if (!admin || admin.role !== 'admin') {
        res.status(401);
        throw new Error('Admin not found');
    }

    const verification = verifyTwoFactorCode(admin, twoFactorCode);
    if (!verification.valid) {
        res.status(401);
        throw new Error(verification.message);
    }

    await clearTwoFactorCode(admin);

    // Return full JWT so the frontend can log the admin in
    res.json(userResponse(admin));
});

// ─── Resend Admin 2FA Code ──────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/admin-resend-2fa
 * @access  Public (guarded by short-lived tempToken)
 */
const resendAdminTwoFactor = asyncHandler(async (req, res) => {
    const { tempToken } = req.body;

    let decoded;
    try {
        decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
        res.status(401);
        throw new Error('Session expired. Please start the login process again.');
    }

    if (!decoded.adminAuth || !decoded.temp) {
        res.status(401);
        throw new Error('Invalid session token');
    }

    const admin = await User.findById(decoded.id)
        .select('+twoFactorCode +twoFactorCodeExpires');
    if (!admin || admin.role !== 'admin') {
        res.status(401);
        throw new Error('Admin not found');
    }

    await generateAndStoreTwoFactorCode(admin);

    // Issue a fresh 10-min temp token so the timer resets
    const newTempToken = jwt.sign(
        { id: admin._id, email: admin.email, adminAuth: true, temp: true },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
    );

    res.json({
        message: '2FA code resent',
        tempToken: newTempToken,
        email: admin.email,
    });
});

// ─── Login ───────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, twoFactorCode } = req.body;

    const user = await User.findOne({ email }).select('+twoFactorCode +twoFactorCodeExpires');
    if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // If 2FA is enabled
    if (user.twoFactorEnabled) {
        // If no 2FA code provided, send one
        if (!twoFactorCode) {
            await generateAndStoreTwoFactorCode(user);
            return res.status(200).json({
                message: '2FA code sent to your email',
                requiresTwoFactor: true,
                email: user.email
            });
        }

        // Verify 2FA code
        const verification = verifyTwoFactorCode(user, twoFactorCode);
        if (!verification.valid) {
            res.status(401);
            throw new Error(verification.message);
        }

        // Clear 2FA code after successful verification
        await clearTwoFactorCode(user);
    }

    res.json(userResponse(user));
});

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
    // In a real-world scenario, you might want to:
    // 1. Add the token to a blacklist
    // 2. Remove the token from user's active tokens list
    // 3. Or use refresh tokens

    // For now, we'll just send a success response
    // The frontend will handle removing the token from localStorage

    res.json({
        message: 'Logged out successfully'
    });
});

// ─── Google OAuth Callback ────────────────────────────────────────────────────

/**
 * @route   GET /api/auth/google/callback (handled after passport redirect)
 * @access  Public
 */
const googleCallback = asyncHandler(async (req, res) => {
    const user = req.user;
    
    // Attempt to decode state parameter mapped from frontend
    let stateObj = {};
    if (req.query.state) {
        try {
            stateObj = JSON.parse(Buffer.from(req.query.state, 'base64').toString('ascii'));
        } catch (e) {
            console.error('Failed to parse OAuth state', e);
        }
    }

    const isSourceAdmin = stateObj.source === 'admin';
    const targetUrl = isSourceAdmin ? (process.env.ADMIN_CLIENT_URL || 'http://localhost:5174') : process.env.CLIENT_URL;

    // ── Admin flow: handle both pre-verified and direct Google login ────────────
    const expectedEmail = req.session?.expectedAdminEmail || stateObj.expectedAdminEmail;
    console.log(`📡 Google Callback for ${user.email}. Source: ${isSourceAdmin ? 'ADMIN' : 'USER'}. Expected Admin: ${expectedEmail || 'NONE'}`);

    if (isSourceAdmin) {
        // Enforce admin role check even without pre-verified email
        if (user.role !== 'admin') {
            console.log(`⛔ Direct admin OAuth access denied for non-admin: ${user.email}`);
            return res.redirect(`${targetUrl}/auth?error=NOT_ADMIN&admin=1`);
        }

        if (expectedEmail) {
            // Cleanup session if it was a pre-verified flow
            delete req.session.expectedAdminEmail;
            req.session.save();

            // Reject if the signed-in Google account doesn't match the specific admin email
            if (user.email.toLowerCase() !== expectedEmail.toLowerCase()) {
                console.log(`⛔ Admin OAuth email mismatch: expected ${expectedEmail}, got ${user.email}`);
                return res.redirect(
                    `${targetUrl}/auth?error=EMAIL_MISMATCH&admin=1&expected=${encodeURIComponent(expectedEmail)}`
                );
            }
        }

        // ✅ Admin verified — login directly
        console.log('✅ Admin Google OAuth complete. Logging in directly:', user.email);
        const token = generateToken(user._id);

        // For admin portal, we can redirect to /auth with token or /auth/success
        // Let's use the same success page if it exists in admin portal
        return res.redirect(`${targetUrl}/auth/success?token=${token}`);
    }

    // ── Regular user flow ──────────────────────────────────────────────────────
    if (user.twoFactorEnabled) {
        const tempToken = jwt.sign(
            { id: user._id, email: user.email, googleAuth: true, temp: true },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );
        return res.redirect(`${targetUrl}/auth/2fa?tempToken=${tempToken}&email=${user.email}`);
    }

    const token = generateToken(user._id);
    res.redirect(`${targetUrl}/auth/success?token=${token}`);
});

// ─── Google OAuth 2FA Verification ─────────────────────────────────────────────

/**
 * @route   POST /api/auth/google-verify-2fa
 * @access  Public
 */
const verifyGoogleTwoFactor = asyncHandler(async (req, res) => {
    const { tempToken, twoFactorCode } = req.body;

    try {
        // Verify the temporary token
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

        if (!decoded.temp || !decoded.googleAuth) {
            res.status(401);
            throw new Error('Invalid temporary token');
        }

        // Get user from temp token
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401);
            throw new Error('User not found');
        }

        // Check if user is still active
        if (user.status !== 'active') {
            res.status(403);
            throw new Error('Account suspended or inactive');
        }

        // Verify 2FA code
        const verification = verifyTwoFactorCode(user, twoFactorCode);
        if (!verification.valid) {
            res.status(401);
            throw new Error(verification.message);
        }

        // Clear 2FA code after successful verification
        await clearTwoFactorCode(user);

        // Generate full JWT token
        const fullToken = generateToken(user._id);

        res.json({
            message: '2FA verified successfully',
            token: fullToken,
            user: userResponse(user)
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            res.status(401);
            throw new Error('Temporary token expired or invalid');
        }
        throw error;
    }
});

// ─── Get Profile ─────────────────────────────────────────────────────────────

/**
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(userResponse(user));
});

// ─── Update Profile ───────────────────────────────────────────────────────────

/**
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.username = req.body.username || user.username;
    user.avatar = req.body.avatar || user.avatar;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();
    res.json(userResponse(updatedUser));
});

// ─── Change Password ──────────────────────────────────────────────────────────

/**
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        res.status(400);
        throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
});

// ─── Address Management ───────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/address
 * @access  Private
 */
const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    const { fullName, address, city, postalCode, country, phone, isDefault } = req.body;

    // If new address is default, unset existing defaults
    if (isDefault) {
        user.addresses.forEach(a => { a.isDefault = false; });
    }

    user.addresses.push({ fullName, address, city, postalCode, country, phone, isDefault: isDefault || false });
    await user.save();
    res.status(201).json(user.addresses);
});

/**
 * @route   PUT /api/auth/address/:id/default
 * @access  Private
 */
const setDefaultAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    user.addresses.forEach(a => {
        a.isDefault = a._id.toString() === req.params.id;
    });

    await user.save();
    res.json(user.addresses);
});

/**
 * @route   DELETE /api/auth/address/:id
 * @access  Private
 */
const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
});

// ─── Toggle 2FA ────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/toggle-2fa
 * @access  Private
 */
const toggleTwoFactor = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Toggle 2FA status
    user.twoFactorEnabled = !user.twoFactorEnabled;
    user.twoFactorMethod = user.twoFactorEnabled ? 'email' : undefined;

    await user.save();

    res.json({
        message: user.twoFactorEnabled ? '2FA enabled successfully' : '2FA disabled successfully',
        twoFactorEnabled: user.twoFactorEnabled
    });
});

// ─── Send Test 2FA Code ─────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/send-test-2fa
 * @access  Private
 */
const sendTestTwoFactorCode = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Create a temporary test object
    const testUser = {
        email: email,
        twoFactorEnabled: true,
        twoFactorMethod: 'email',
        save: async () => { } // Mock save for testing
    };

    // Generate and send test code
    const code = await generateAndStoreTwoFactorCode(testUser);

    console.log(`🧪 Test 2FA code for ${email}: ${code}`);

    res.json({
        message: 'Test 2FA code sent successfully',
        email: email
    });
});

module.exports = {
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
};
