# Cloudflare R2 Image Upload System - Setup Guide

## Overview
This guide explains how to set up and use the Cloudflare R2 image upload system for the Endura e-commerce application. All images (products, assets, vault cards, etc.) are stored in R2 and only URLs are stored in MongoDB.

## Prerequisites
1. Cloudflare R2 bucket created
2. Public access enabled on the bucket
3. R2 API tokens generated
4. Custom domain configured (optional but recommended)

## Environment Variables Setup

Add these variables to your `.env` file:

```env
# Cloudflare R2 Configuration
R2_ACCESS_KEY=your_r2_access_key_here
R2_SECRET_KEY=your_r2_secret_key_here
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-custom-domain.com
```

### How to Get R2 Credentials

1. **Create R2 Bucket:**
   - Go to Cloudflare Dashboard → R2
   - Create a new bucket
   - Enable public access if using custom domain

2. **Generate API Tokens:**
   - Go to Cloudflare Dashboard → R2 → Manage API Tokens
   - Create a new token with read/write permissions
   - Copy Access Key ID and Secret Access Key

3. **Get Account ID:**
   - Your R2 endpoint will be: `https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com`
   - Find your Account ID in Cloudflare Dashboard → Overview

4. **Custom Domain (Recommended):**
   - Configure a custom domain for your R2 bucket
   - This provides cleaner URLs and better performance
   - Example: `https://images.yourdomain.com`

## API Endpoints

### 1. Upload Images
**Endpoint:** `POST /api/upload/admin/upload-image`

**Features:**
- Multiple image upload (up to 10 files)
- 2MB max file size per image
- Automatic organization by type/folder
- Supported formats: JPEG, PNG, WebP, GIF, SVG

**Request:**
```javascript
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);
formData.append('type', 'products'); // Optional: products, vault, assets, etc.

const response = await fetch('/api/upload/admin/upload-image', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "message": "Images uploaded successfully",
  "urls": [
    "https://images.yourdomain.com/products/1640995200000-image1.jpg",
    "https://images.yourdomain.com/products/1640995200001-image2.png"
  ],
  "count": 2
}
```

### 2. Delete Image
**Endpoint:** `DELETE /api/upload/admin/delete-image`

**Request:**
```javascript
await fetch('/api/upload/admin/delete-image', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    "imageUrl": "https://images.yourdomain.com/products/1640995200000-image1.jpg"
  })
});
```

### 3. Replace Image
**Endpoint:** `PUT /api/upload/admin/replace-image`

**Request:**
```javascript
const formData = new FormData();
formData.append('image', newFile);
formData.append('oldImageUrl', 'https://images.yourdomain.com/products/old-image.jpg');

await fetch('/api/upload/admin/replace-image', {
  method: 'PUT',
  body: formData
});
```

## File Organization

Images are automatically organized in your R2 bucket:

```
your-bucket/
├── products/
│   ├── 1640995200000-shirt.jpg
│   ├── 1640995200001-pants.png
│   └── ...
├── vault/
│   ├── 1640995200002-card-front.jpg
│   ├── 1640995200003-card-back.png
│   └── ...
├── assets/
│   └── ...
└── ...
```

## Integration with Existing Models

The system is designed to work seamlessly with your existing MongoDB models:

### Asset Model
```javascript
// Images stored as array of URLs
{
  "images": [
    "https://images.yourdomain.com/products/1640995200000-image1.jpg",
    "https://images.yourdomain.com/products/1640995200001-image2.jpg"
  ]
}
```

### VaultCard Model
```javascript
{
  "frontImage": "https://images.yourdomain.com/vault/1640995200002-front.jpg",
  "backImage": "https://images.yourdomain.com/vault/1640995200003-back.jpg"
}
```

## Migration from Local Storage

If you have existing images in local storage, you'll need to:

1. Upload them to R2 using the new endpoints
2. Update database records with new URLs
3. Remove old local files

## Frontend Integration Examples

### React Component for Image Upload
```jsx
import { useState } from 'react';

function ImageUpload({ onUpload, type = 'products' }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files) => {
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      formData.append('type', type);

      const response = await fetch('/api/upload/admin/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      onUpload(data.urls);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleUpload(Array.from(e.target.files))}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request:** Missing files, invalid file types
- **413 Payload Too Large:** File exceeds 2MB limit
- **500 Internal Server Error:** R2 connection issues

## Security Considerations

1. **File Type Validation:** Only image files are accepted
2. **Size Limits:** 2MB maximum per file
3. **Public Access:** Images are publicly accessible via URLs
4. **CORS:** Configure CORS in R2 bucket settings if needed

## Cost Optimization

- Use appropriate image formats (WebP for better compression)
- Implement image resizing on upload if needed
- Monitor R2 usage in Cloudflare dashboard
- Consider Cloudflare Images for advanced optimization

## Troubleshooting

### Common Issues:

1. **"Access Denied" errors:**
   - Check R2 credentials in .env
   - Verify token permissions

2. **"Bucket does not exist":**
   - Confirm bucket name in R2_BUCKET_NAME
   - Check account ID in endpoint URL

3. **Images not loading:**
   - Verify public access is enabled
   - Check custom domain configuration
   - Confirm R2_PUBLIC_URL is correct

### Testing the Setup:

Run the test script:
```bash
cd backend
node test-r2.js
```

This will verify that the R2 service initializes correctly and environment variables are loaded.