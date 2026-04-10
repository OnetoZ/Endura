const express = require('express');
const router = express.Router();
const {
    getAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset,
} = require('../controllers/assetController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .get(getAssets)
    .post(protect, admin, createAsset);

router.route('/:id')
    .get(getAssetById)
    .put(protect, admin, updateAsset)
    .delete(protect, admin, deleteAsset);

module.exports = router;
