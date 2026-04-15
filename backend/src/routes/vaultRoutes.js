const express = require('express');
const router = express.Router();
const { getVaultCards, createVaultCard, updateVaultCard, deleteVaultCard } = require('../controllers/vaultCardController');

const { getUserVault, redeemVaultItem, collectVaultCard, getAllVaultItems, deleteVaultItemAdmin, updateVaultItemAdmin, syncVaultCardByCode } = require('../controllers/vaultController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getUserVault);
router.post('/sync', protect, syncVaultCardByCode);
router.put('/:id/redeem', protect, redeemVaultItem);
router.post('/:id/collect', protect, collectVaultCard);
router.get('/all', protect, admin, getAllVaultItems);

router.delete('/item/:id', protect, admin, deleteVaultItemAdmin);
router.put('/item/:id', protect, admin, updateVaultItemAdmin);



// ── Vault Cards (admin-created collectibles) ───────────────────────────────
router.get('/cards', getVaultCards);
router.post('/cards', protect, admin, createVaultCard);
router.put('/cards/:id', protect, admin, updateVaultCard);
router.delete('/cards/:id', protect, admin, deleteVaultCard);

module.exports = router;
