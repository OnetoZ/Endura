const mongoose = require('./backend/node_modules/mongoose');
const dotenv = require('./backend/node_modules/dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend/.env') });

async function purgeDressItems() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;

        // 1. Purge from redemptioncodes
        const codesResult = await db.collection('redemptioncodes').deleteMany({ 
            image: { $regex: /TSHIRT DC/i } 
        });
        console.log(`Removed ${codesResult.deletedCount} items from redemptioncodes`);

        // 2. Purge from vaultitems
        const vaultItemsResult = await db.collection('vaultitems').deleteMany({ 
            productImage: { $regex: /TSHIRT DC/i } 
        });
        console.log(`Removed ${vaultItemsResult.deletedCount} items from vaultitems`);

        // 3. Purge from products just in case
        const productsResult = await db.collection('products').deleteMany({ 
            name: { $regex: /TSHIRT DC|Dress/i } 
        });
        console.log(`Removed ${productsResult.deletedCount} items from products`);

        console.log('✅ Purge completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during purge:', error);
        process.exit(1);
    }
}

purgeDressItems();
