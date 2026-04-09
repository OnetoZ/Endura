const mongoose = require('./backend/node_modules/mongoose');
const dotenv = require('./backend/node_modules/dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend/.env') });

const VaultCardSchema = new mongoose.Schema({
    name: String,
    description: String,
    frontImage: String,
    backImage: String,
    category: String,
    serialNumber: Number,
    batchId: Number
}, { timestamps: true });

const VaultCard = mongoose.models.VaultCard || mongoose.model('VaultCard', VaultCardSchema);

async function seedVaultCards() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const cards = [
            {
                name: "NEO_BOTANIC_09",
                description: "BIO_SYNTHETIC ARCHIVE // LEVEL_09",
                frontImage: "/tarot-card-13.png",
                backImage: "/tarot-card-13.png",
                category: "Legendary",
                serialNumber: 1,
                batchId: 1
            }
        ];

        for (const card of cards) {
            await VaultCard.findOneAndUpdate(
                { name: card.name },
                card,
                { upsert: true, new: true }
            );
        }

        console.log('✅ Vault Cards seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding vault cards:', error);
        process.exit(1);
    }
}

seedVaultCards();
