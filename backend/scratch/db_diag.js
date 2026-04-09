const mongoose = require('mongoose');
require('dotenv').config({ path: '/Users/sandhanam/Documents/Projects/endura/Endura/backend/.env' });

const diag = async () => {
    try {
        console.log('--- DB DIAGNOSTIC ---');
        console.log('URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // Get collection list
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Available Collections:', collections.map(c => c.name));

        // Check Products
        const productsCount = await db.collection('products').countDocuments();
        console.log('Raw "products" count:', productsCount);

        const oneProduct = await db.collection('products').findOne({});
        console.log('Sample Product Item:', JSON.stringify(oneProduct, null, 2));

        // Check Orders (for comparison)
        const ordersCount = await db.collection('orders').countDocuments();
        console.log('Raw "orders" count:', ordersCount);

        process.exit(0);
    } catch (e) {
        console.error('DIAG ERROR:', e);
        process.exit(1);
    }
};

diag();
