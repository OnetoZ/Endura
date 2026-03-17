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

        // Update or create new admin
        const adminData = {
            username: 'Endura Team',
            email: 'enduraclothing.team@gmail.com',
            role: 'admin',
            isVerified: true,
            twoFactorEnabled: false
        };

        const result = await User.findOneAndUpdate(
            { email: 'enduraclothing.team@gmail.com' },
            { $set: adminData },
            { new: true, upsert: true }
        );

        console.log('✅ Admin user created/updated successfully!');
        console.log('   Email:    enduraclothing.team@gmail.com');
        console.log('   Role:     Admin');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

seedAdmin();
