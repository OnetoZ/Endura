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
}, { collection: 'vaultcards' });

const VaultCard = mongoose.models.VaultCard || mongoose.model('VaultCard', VaultCardSchema);

async function seedVaultCards() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const cards = [
            {
                name: "NEO_BOTANIC_BLACK",
                description: "BIO_SYNTHETIC ARCHIVE // GENERATION_01",
                frontImage: "/uploads/BLACK TSHIRT DC.png",
                backImage: "/uploads/BLACK TSHIRT DC.png",
                category: "Legendary",
                serialNumber: 1,
                batchId: 1
            },
            {
                name: "NEO_BOTANIC_BLUE",
                description: "BIO_SYNTHETIC ARCHIVE // GENERATION_01",
                frontImage: "/uploads/BLUE TSHIRT DC.png",
                backImage: "/uploads/BLUE TSHIRT DC.png",
                category: "Epic",
                serialNumber: 2,
                batchId: 1
            }
        ];

        await VaultCard.deleteMany({});
        for (const card of cards) {
            await VaultCard.create(card);
        }

        console.log('✅ Vault Cards seeded successfully with local assets');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding vault cards:', error);
        process.exit(1);
    }
}

seedVaultCards();
