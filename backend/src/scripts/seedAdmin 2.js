/**
 * Endura Admin Seeder Script (Final Version)
 * Run: node src/scripts/seedAdmin\ 2.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        console.log('📡 Connecting to Secure Cluster...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Uplink Established.');

        const ADMIN_EMAIL = 'enduraclothing.team@gmail.com';

        // Clear any old admin roles (optional, ensuring only one admin exists)
        // await User.updateMany({ role: 'admin' }, { role: 'user' });

        // Update or create new admin user
        const result = await User.findOneAndUpdate(
            { email: ADMIN_EMAIL },
            {
                $set: {
                    username: 'Endura Team',
                    role: 'admin',
                    isVerified: true,
                    twoFactorEnabled: false, // 2FA REMOVED
                    twoFactorMethod: 'email',
                    status: 'active'
                }
            },
            { new: true, upsert: true }
        );

        console.log('✅ Admin user created/updated successfully!');
        console.log('   Email:    ' + ADMIN_EMAIL);
        console.log('   ID:       ' + result._id);
        console.log('   2FA:      Disabled');
        console.log('   Role:     Admin');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
