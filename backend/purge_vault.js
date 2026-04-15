require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function purgeJunk() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const VaultItem = require('./src/models/VaultItem');
  
  // Find items where vaultCard is nulled/missing or name was default
  // We'll look for items that don't have a valid vaultCard reference
  const items = await VaultItem.find().populate('vaultCard');
  const junkIds = items
    .filter(item => !item.vaultCard || item.vaultCard.name === 'Protocol Sync')
    .map(item => item._id);

  console.log(`Found ${junkIds.length} junk vault items.`);
  
  if (junkIds.length > 0) {
    const result = await VaultItem.deleteMany({ _id: { $in: junkIds } });
    console.log(`Purge complete. Deleted ${result.deletedCount} items.`);
  } else {
    console.log('Archive is already clean.');
  }
  
  mongoose.disconnect();
}

purgeJunk().catch(console.error);
