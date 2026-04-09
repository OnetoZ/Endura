const mongoose = require('mongoose');
require('dotenv').config();

async function checkDb() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        const dbName = mongoose.connection.name;
        console.log('Database Name:', dbName);
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        
        const sampleCode = await mongoose.connection.db.collection('redemptioncodes').findOne({});
        console.log('Sample Code:', sampleCode);
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Error:', err);
        process.exit(1);
    }
}

checkDb();
