const express = require('express');
const router = express.Router();
const { getVaultCards, createVaultCard, updateVaultCard, deleteVaultCard } = require('../controllers/vaultCardController');
const { getRedemptionCodes, importRedemptionCodes, redeemProvidedCode } = require('../controllers/vaultCodeController');
const { getUserVault, redeemVaultItem, collectVaultCard, getAllVaultItems } = require('../controllers/vaultController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getUserVault);
router.put('/:id/redeem', protect, redeemVaultItem);
router.post('/:id/collect', protect, collectVaultCard);
router.get('/all', protect, admin, getAllVaultItems);

// ── Redemption Codes (The 1-100 serial codes) ──────────────────────────────
router.get('/codes', protect, admin, getRedemptionCodes);
router.post('/codes/import', protect, admin, importRedemptionCodes);
router.post('/redeem-code', protect, redeemProvidedCode);

// ── Vault Cards (admin-created collectibles) ───────────────────────────────
router.get('/cards', getVaultCards);
router.post('/cards', protect, admin, createVaultCard);
router.put('/cards/:id', protect, admin, updateVaultCard);
router.delete('/cards/:id', protect, admin, deleteVaultCard);

module.exports = router;
