const mongoose = require('mongoose');
require('dotenv').config({ path: '/Users/sandhanam/Documents/Projects/endura/Endura/backend/.env' });

const ProductSchema = new mongoose.Schema({
    name: String,
    isActive: Boolean
}, { strict: false });

const Product = mongoose.model('Product', ProductSchema);

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const allProducts = await Product.find({});
        console.log(`Total Products in DB: ${allProducts.length}`);
        
        allProducts.forEach(p => {
            console.log(`- ${p.name}: isActive=${p.isActive}`);
        });

        const activeProducts = await Product.find({ isActive: true });
        console.log(`Active Products in DB: ${activeProducts.length}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkProducts();
