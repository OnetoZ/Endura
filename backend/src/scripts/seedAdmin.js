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
        const existing = await User.findOne({ email: 'admin@endura.com' });
        if (existing) {
            console.log('⚠️  Admin already exists:', existing.email);
            process.exit(0);
        }

        const admin = await User.create({
            username: 'Admin',
            email: 'admin@endura.com',
            password: 'Admin@2024',
            role: 'admin',
            isVerified: true,
        });

        console.log('✅ Admin user created successfully!');
        console.log('   Email:    admin@endura.com');
        console.log('   Password: Admin@2024');
        console.log('   ID:', admin._id);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
