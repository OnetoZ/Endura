const fs = require('fs');
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

    const folder = req.body.type || 'products';

    try {
        const imageUrls = await r2Service.uploadMultipleFiles(req.files, folder);
        res.json({
            message: 'Images uploaded successfully',
            urls: imageUrls,
            count: imageUrls.length
        });
    } catch (error) {
        console.error('R2 Multiple Upload Error - Falling back to local storage:', error);
        
        try {
            const imageUrls = [];
            const uploadsDir = path.join(__dirname, '../../uploads');
            
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            for (const file of req.files) {
                const timestamp = Date.now();
                const fileName = `image-${timestamp}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
                const localPath = path.join(uploadsDir, fileName);
                fs.writeFileSync(localPath, file.buffer);
                imageUrls.push(`/uploads/${fileName}`);
            }

            res.json({
                message: 'Images uploaded to local storage (R2 failure fallback)',
                urls: imageUrls,
                count: imageUrls.length
            });
        } catch (localError) {
            console.error('Local Multiple Fallback Error:', localError);
            res.status(500).json({ message: 'Error uploading images', error: localError.message });
        }
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
    console.log('[UPLOAD DEBUG] Request received. Folder:', req.body.type || 'products');
    console.log('[UPLOAD DEBUG] File object present:', !!req.file);

    if (!req.file) {
        console.error('[UPLOAD DEBUG] No file found in request');
        return res.status(400).json({ message: 'No image uploaded after multer pass' });
    }

    console.log('[UPLOAD DEBUG] File details:', {
        name: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
    });

    const folder = req.body.type || 'products';

    try {
        console.log('[UPLOAD DEBUG] Attempting R2 upload...');
        const imageUrl = await r2Service.uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            folder
        );
        console.log('[UPLOAD DEBUG] R2 Success:', imageUrl);

        res.json({
            url: imageUrl,
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        console.error('[UPLOAD DEBUG] R2 Service Error:', error.message);
        console.log('[UPLOAD DEBUG] Falling back to local storage...');
        
        try {
            const timestamp = Date.now();
            const fileName = `image-${timestamp}${path.extname(req.file.originalname)}`;
            const uploadsDir = path.join(__dirname, '../../uploads');
            
            console.log('[UPLOAD DEBUG] Local path target:', path.join(uploadsDir, fileName));

            if (!fs.existsSync(uploadsDir)) {
                console.log('[UPLOAD DEBUG] Creating uploads directory...');
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            const localPath = path.join(uploadsDir, fileName);
            fs.writeFileSync(localPath, req.file.buffer);
            
            const localUrl = `/uploads/${fileName}`;
            console.log('[UPLOAD DEBUG] Local Fallback Success:', localUrl);

            res.json({
                url: localUrl,
                message: 'Image uploaded to local storage (R2 failure fallback)'
            });
        } catch (localError) {
            console.error('[UPLOAD DEBUG] Local Fallback Error:', localError.message);
            res.status(500).json({ 
                message: 'Total upload failure', 
                error: localError.message 
            });
        }
    }
}));

module.exports = router;
