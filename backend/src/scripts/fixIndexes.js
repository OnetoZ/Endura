/**
 * Fix stale MongoDB indexes that cause "OrderId already exists" errors.
 * Run with: npx nodemon --no-watch src/scripts/fixIndexes.js
 * Or:       node src/scripts/fixIndexes.js  (if node is in PATH)
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../../.env', override: true });
// Fallback: try local .env
if (!process.env.MONGO_URI) {
    dotenv.config({ override: true });
}

const run = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected\n');

        const db = mongoose.connection.db;

        // ── 1. Check & fix orders collection indexes ──
        console.log('── Orders Collection Indexes ──');
        const orderIndexes = await db.collection('orders').indexes();
        console.log(JSON.stringify(orderIndexes, null, 2));

        // Drop any unique index on razorpayOrderId (stale from old schema)
        for (const idx of orderIndexes) {
            const keys = Object.keys(idx.key);
            if (keys.includes('razorpayOrderId') && idx.unique) {
                console.log(`\n⚠️  Found stale UNIQUE index on razorpayOrderId: "${idx.name}"`);
                console.log('   Dropping it...');
                await db.collection('orders').dropIndex(idx.name);
                console.log('   ✅ Dropped successfully');
            }
            if (keys.includes('orderId') && idx.unique) {
                console.log(`\n⚠️  Found stale UNIQUE index on orderId: "${idx.name}"`);
                console.log('   Dropping it...');
                await db.collection('orders').dropIndex(idx.name);
                console.log('   ✅ Dropped successfully');
            }
        }

        // ── 2. Clean stale pending orders ──
        console.log('\n── Cleaning Stale Pending Orders ──');
        const staleResult = await db.collection('orders').deleteMany({
            paymentStatus: 'pending',
            createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // older than 24h
        });
        console.log(`Deleted ${staleResult.deletedCount} stale pending orders (older than 24h)`);

        // ── 3. Check carts collection ──
        console.log('\n── Carts Collection Indexes ──');
        const cartIndexes = await db.collection('carts').indexes();
        console.log(JSON.stringify(cartIndexes, null, 2));

        // ── 4. Summary ──
        const orderCount = await db.collection('orders').countDocuments();
        const cartCount = await db.collection('carts').countDocuments();
        const userCount = await db.collection('users').countDocuments();
        const assetCount = await db.collection('assets').countDocuments();
        console.log('\n── Database Stats ──');
        console.log(`Orders: ${orderCount}`);
        console.log(`Carts:  ${cartCount}`);
        console.log(`Users:  ${userCount}`);
        console.log(`Assets: ${assetCount}`);

        console.log('\n✅ Index fix complete');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

run();
