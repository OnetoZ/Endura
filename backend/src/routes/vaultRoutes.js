const express = require('express');
const router = express.Router();
const { getUserVault, redeemVaultItem, getAllVaultItems } = require('../controllers/vaultController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getUserVault);
router.put('/:id/redeem', protect, redeemVaultItem);
router.get('/all', protect, admin, getAllVaultItems);

module.exports = router;
