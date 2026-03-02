const express = require('express');
const router = express.Router();
const { getUserVault, redeemVaultItem, getAllVaultItems, collectVaultCard } = require('../controllers/vaultController');
const { getVaultCards, createVaultCard, updateVaultCard, deleteVaultCard } = require('../controllers/vaultCardController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getUserVault);
router.put('/:id/redeem', protect, redeemVaultItem);
router.post('/:id/collect', protect, collectVaultCard);
router.get('/all', protect, admin, getAllVaultItems);

// ── Vault Cards (admin-created collectibles) ───────────────────────────────
router.get('/cards', getVaultCards);
router.post('/cards', protect, admin, createVaultCard);
router.put('/cards/:id', protect, admin, updateVaultCard);
router.delete('/cards/:id', protect, admin, deleteVaultCard);

module.exports = router;
