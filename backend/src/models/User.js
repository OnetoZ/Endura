const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    phone: { type: String },
    isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    // Google OAuth
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    avatar: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    addresses: [addressSchema],
    // Credits system
    credits: {
        type: Number,
        default: 0,
        min: 0,
    },
    // User preferences
    preferences: {
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true },
        },
        theme: {
            type: String,
            enum: ['dark', 'light', 'auto'],
            default: 'dark',
        },
        language: {
            type: String,
            default: 'en',
        },
    },
    // User activity tracking
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    loginCount: {
        type: Number,
        default: 0,
    },
    // Profile completion
    profileCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    // Account status
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
    },
    // Referral system
    referralCode: {
        type: String,
        unique: true,
        sparse: true,
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        sparse: true,
    },
    // Wishlist and cart references (for quick access)
    wishlistCount: {
        type: Number,
        default: 0,
    },
    cartCount: {
        type: Number,
        default: 0,
    },
    // Order statistics
    totalOrders: {
        type: Number,
        default: 0,
    },
    totalSpent: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Hash password before saving (skip if it's a Google OAuth placeholder)
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate user tier based on credits
userSchema.methods.getTier = function() {
    if (this.credits >= 1000) return { name: 'Gold', level: 3 };
    if (this.credits >= 500) return { name: 'Silver', level: 2 };
    return { name: 'Bronze', level: 1 };
};

// Calculate profile completion percentage
userSchema.methods.calculateProfileCompletion = function() {
    let completion = 0;
    const fields = [
        { field: this.username, weight: 20 },
        { field: this.email, weight: 20 },
        { field: this.phone, weight: 15 },
        { field: this.avatar, weight: 15 },
        { field: this.addresses && this.addresses.length > 0, weight: 30 },
    ];
    
    fields.forEach(({ field, weight }) => {
        if (field && (typeof field !== 'string' || field.trim() !== '')) {
            completion += weight;
        }
    });
    
    return Math.min(completion, 100);
};

// Update profile completion
userSchema.pre('save', function(next) {
    if (this.isModified('username') || this.isModified('email') || 
        this.isModified('phone') || this.isModified('avatar') || 
        this.isModified('addresses')) {
        this.profileCompletion = this.calculateProfileCompletion();
    }
    next();
});

// Generate referral code
userSchema.pre('save', function(next) {
    if (!this.referralCode && this.isNew) {
        const code = this.username.substring(0, 3).toUpperCase() + 
                     Math.random().toString(36).substring(2, 8).toUpperCase();
        this.referralCode = code;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
