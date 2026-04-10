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
}, { _id: false });

const creditHistorySchema = new mongoose.Schema({
    delta: { type: Number, required: true },
    reason: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: function () {
            return this.role !== 'admin' && !this.googleId;
        },
        minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        index: true
    },
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
    twoFactorEnabled: {
        type: Boolean,
        default: false,
    },
    twoFactorMethod: {
        type: String,
        enum: ['email', 'sms'],
        default: 'email',
    },
    twoFactorSecret: {
        type: String,
        select: false,
    },
    twoFactorCode: {
        type: String,
        select: false,
    },
    twoFactorCodeExpires: {
        type: Date,
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    addresses: [addressSchema],
    credits: {
        type: Number,
        default: 0,
        min: 0,
    },
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
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    loginCount: {
        type: Number,
        default: 0,
    },
    profileCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
        index: true
    },
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
    wishlistCount: {
        type: Number,
        default: 0,
    },
    cartCount: {
        type: Number,
        default: 0,
    },
    totalOrders: {
        type: Number,
        default: 0,
    },
    totalSpent: {
        type: Number,
        default: 0,
    },
    creditScore: {
        type: Number,
        default: 0,
        min: 0,
    },
    creditHistory: [creditHistorySchema],
}, { 
    timestamps: true,
    collection: 'users'
});

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getTier = function () {
    if (this.credits >= 2000) return { name: 'Legendary', level: 4 };
    if (this.credits >= 1000) return { name: 'Epic', level: 3 };
    if (this.credits >= 500) return { name: 'Rare', level: 2 };
    return { name: 'Common', level: 1 };
};

userSchema.methods.calculateProfileCompletion = function () {
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

module.exports = mongoose.model('User', userSchema);
