const express = require('express');
const multer = require('multer');
const path = require('path');
const r2Service = require('../services/r2Service');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Configure multer for memory storage (no disk storage)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter(req, file, cb) {
        const filetypes = /jpe?g|png|webp|gif|svg/;
        const mimetypes = /image\/(jpe?g|png|webp|gif|svg\+xml)/;

        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = mimetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Images only! (jpeg, png, webp, gif, svg)'));
        }
    }
});

// POST /admin/upload-image - Upload single or multiple images
router.post('/admin/upload-image', upload.array('images', 10), asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
    }

    // Determine folder based on type parameter or default to 'products'
    const folder = req.body.type || 'products';

    try {
        const imageUrls = await r2Service.uploadMultipleFiles(req.files, folder);

        res.json({
            message: 'Images uploaded successfully',
            urls: imageUrls,
            count: imageUrls.length
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading images', error: error.message });
    }
}));

// DELETE /admin/delete-image - Delete image by URL or key
router.delete('/admin/delete-image', asyncHandler(async (req, res) => {
    const { imageUrl, key } = req.body;

    if (!imageUrl && !key) {
        return res.status(400).json({ message: 'Image URL or key is required' });
    }

    const target = imageUrl || key;

    try {
        await r2Service.deleteFile(target);

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Error deleting image', error: error.message });
    }
}));

// PUT /admin/replace-image - Replace existing image
router.put('/admin/replace-image', upload.single('image'), asyncHandler(async (req, res) => {
    const { oldImageUrl } = req.body;

    if (!oldImageUrl) {
        return res.status(400).json({ message: 'Old image URL is required' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'New image is required' });
    }

    // Determine folder based on type parameter or default to 'products'
    const folder = req.body.type || 'products';

    try {
        const newImageUrl = await r2Service.replaceFile(
            oldImageUrl,
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            folder
        );

        res.json({
            message: 'Image replaced successfully',
            url: newImageUrl
        });
    } catch (error) {
        console.error('Replace error:', error);
        res.status(500).json({ message: 'Error replacing image', error: error.message });
    }
}));

// Legacy route for backward compatibility (single image upload)
router.post('/', (req, res, next) => {
    console.log('--- BASE UPLOAD ROUTE START ---');
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(400).json({ message: `Multer error: ${err.message}`, code: err.code });
        } else if (err) {
            console.error('Unknown Upload Error:', err);
            return res.status(500).json({ message: `Upload error: ${err.message}` });
        }
        
        // Everything went fine
        console.log('Multer success, processing file...');
        next();
    });
}, asyncHandler(async (req, res) => {
    console.log('File info:', req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    } : 'NONE');

    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded after multer pass' });
    }

    const folder = req.body.type || 'products';

    try {
        const imageUrl = await r2Service.uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            folder
        );
        console.log('R2 Success:', imageUrl);

        res.json({
            url: imageUrl,
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        console.error('R2 Service Error:', error);
        res.status(500).json({ 
            message: 'Error uploading to R2 service', 
            error: error.message 
        });
    }
}));

module.exports = router;
