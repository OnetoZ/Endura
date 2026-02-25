/**
 * One-time admin seeder script
 * Run: node src/scripts/seedAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'santhanamk9604@gmail.com', role: 'admin' });
        
        if (existingAdmin) {
            console.log('✅ Admin user already exists!');
            console.log('   Email:    santhanamk9604@gmail.com');
            console.log('   Password: Not applicable (Email-only authentication)');
            console.log('   ID:', existingAdmin._id);
            console.log('   2FA:', existingAdmin.twoFactorEnabled ? 'Enabled (Email)' : 'Disabled');
            console.log('   Role: Admin');
            process.exit(0);
        }

        // Create new admin user
        const admin = await User.create({
            username: 'Santhanam',
            email: 'santhanamk9604@gmail.com',
            role: 'admin',
            isVerified: true,
            // 2FA settings
            twoFactorEnabled: true,
            twoFactorMethod: 'email',
            phone: '8122819604' // Optional phone for SMS 2FA
        });

        console.log('✅ Admin user created successfully!');
        console.log('   Email:    santhanamk9604@gmail.com');
        console.log('   Password: Not applicable (Email-only authentication)');
        console.log('   ID:', admin._id);
        console.log('   2FA: Enabled (Email)');
        console.log('   Role: Admin');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

seedAdmin();
