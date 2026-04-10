const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Asset = require('../models/Asset');
const Order = require('../models/Order');
const User = require('../models/User');

dotenv.config({ path: '../../.env', override: true });

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to:', process.env.MONGO_URI.split('@')[1] || 'Local DB');
        
        const assetCount = await Asset.countDocuments();
        const orderCount = await Order.countDocuments();
        const userCount = await User.countDocuments();
        
        console.log('--- DATABASE STATS ---');
        console.log('Assets:', assetCount);
        console.log('Orders:', orderCount);
        console.log('Users :', userCount);
        
        if (assetCount > 0) {
            const firstAsset = await Asset.findOne();
            console.log('Sample Asset:', firstAsset.name);
        }

        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err.message);
        process.exit(1);
    }
};

checkData();
