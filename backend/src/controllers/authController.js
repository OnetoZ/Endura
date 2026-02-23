const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

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

    const user = await User.create({ username, email, password, phone });
    res.status(201).json(userResponse(user));
});

// ─── Login ───────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    res.json(userResponse(user));
});

// ─── Google OAuth Callback ────────────────────────────────────────────────────

/**
 * @route   GET /api/auth/google/callback (handled after passport redirect)
 * @access  Public
 */
const googleCallback = asyncHandler(async (req, res) => {
    // req.user is set by passport strategy
    const token = generateToken(req.user._id);
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
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

module.exports = {
    registerUser,
    loginUser,
    googleCallback,
    getUserProfile,
    updateUserProfile,
    changePassword,
    addAddress,
    setDefaultAddress,
    deleteAddress,
};
