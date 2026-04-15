# ENDURA Backend

This folder contains the API and server logic.

## Responsibilities
- Authentication
- Product management
- Order handling
- Digital collectible logic
- Admin operations
- Image storage and management (Cloudflare R2)

## Setup
1. `cd backend`
2. `npm install`
3. Configure `.env` based on `.env.example`
4. `npm run dev`

## Image Upload System (Cloudflare R2)

The backend uses Cloudflare R2 for all image storage. Images are NOT stored in MongoDB - only URLs are stored.

### Environment Variables Required
```env
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-custom-domain.com
```

### API Endpoints

#### Upload Images
- **POST** `/api/upload/admin/upload-image`
- Accepts multiple images (up to 10)
- Max file size: 2MB per image
- Supported formats: JPEG, PNG, WebP, GIF, SVG
- Query param `type`: folder to upload to (products, vault, assets, etc.)

**Example:**
```javascript
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);
formData.append('type', 'products'); // optional, defaults to 'products'

fetch('/api/upload/admin/upload-image', {
  method: 'POST',
  body: formData
});
```

#### Delete Image
- **DELETE** `/api/upload/admin/delete-image`
- Body: `{ "imageUrl": "https://..." }` or `{ "key": "products/123-image.jpg" }`

#### Replace Image
- **PUT** `/api/upload/admin/replace-image`
- Body: `{ "oldImageUrl": "https://..." }`
- Form data: new image file

### File Organization
Images are organized in R2 bucket by type:
- `products/` - Product images
- `vault/` - Vault card images
- `assets/` - Asset images
- etc.

File naming: `{timestamp}-{original-filename}`

## Scalability Note
Database and storage can be scaled independently.
Additional cloud costs apply if usage exceeds base limits.
