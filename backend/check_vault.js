require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function checkDb() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const VaultCard = require('./src/models/VaultCard');
  const VaultItem = require('./src/models/VaultItem');
  
  const cards = await VaultCard.find().lean();
  const items = await VaultItem.find().lean();
  
  console.log('VaultCards count:', cards.length);
  console.log('VaultCards:', JSON.stringify(cards, null, 2));
  console.log('---');
  console.log('VaultItems count:', items.length);
  console.log('VaultItems:', JSON.stringify(items, null, 2));
  
  mongoose.disconnect();
}

checkDb().catch(console.error);
