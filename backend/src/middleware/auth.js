const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect routes - Verifies JWT token and attaches user to request
 */
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        res.status(401);
        throw new Error('Access denied. No token provided.');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'endura_secret_key_2024');

        // Get user from the token (excluding password and sensitive fields)
        req.user = await User.findById(decoded.id).select('-password -twoFactorSecret -twoFactorCode -twoFactorCodeExpires');

        if (!req.user) {
            res.status(401);
            throw new Error('Token is valid but user not found');
        }

        // Check if user is still active/verified
        if (!req.user.isVerified) {
            res.status(401);
            throw new Error('Account not verified');
        }

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            res.status(401);
            throw new Error('Invalid token');
        } else if (error.name === 'TokenExpiredError') {
            res.status(401);
            throw new Error('Token expired');
        } else {
            res.status(401);
            throw new Error('Token verification failed');
        }
    }
});

/**
 * Admin check - Ensures the user has an admin role
 */
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin };
