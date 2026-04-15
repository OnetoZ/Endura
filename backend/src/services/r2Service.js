const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../utils/r2Client');

class R2Service {
    constructor() {
        this.bucketName = process.env.R2_BUCKET_NAME;
        this.publicUrl = process.env.R2_PUBLIC_URL;
    }

    /**
     * Upload a single file to R2
     * @param {Buffer} fileBuffer - File buffer
     * @param {string} fileName - Original file name
     * @param {string} mimeType - File MIME type
     * @param {string} folder - Folder path (e.g., 'products', 'vault', 'assets')
     * @returns {string} Public URL of uploaded file
     */
    async uploadFile(fileBuffer, fileName, mimeType, folder = 'products') {
        const timestamp = Date.now();
        const extension = fileName.split('.').pop();
        const key = `${folder}/${timestamp}-${fileName}`;

        const uploadParams = {
            Bucket: this.bucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType,
        };

        try {
            await s3Client.send(new PutObjectCommand(uploadParams));
            return `${this.publicUrl}/${key}`;
        } catch (error) {
            console.error('R2 upload error:', error);
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

    /**
     * Upload multiple files to R2
     * @param {Array} files - Array of file objects with buffer, originalname, mimetype
     * @param {string} folder - Folder path
     * @returns {Array<string>} Array of public URLs
     */
    async uploadMultipleFiles(files, folder = 'products') {
        const uploadPromises = files.map(file =>
            this.uploadFile(file.buffer, file.originalname, file.mimetype, folder)
        );

        try {
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('R2 multiple upload error:', error);
            throw new Error(`Failed to upload files: ${error.message}`);
        }
    }

    /**
     * Delete a file from R2
     * @param {string} imageUrl - Full public URL or just the key
     * @returns {boolean} Success status
     */
    async deleteFile(imageUrl) {
        // Extract key from URL or use as-is if it's already a key
        let key;
        if (imageUrl.startsWith(this.publicUrl)) {
            key = imageUrl.replace(`${this.publicUrl}/`, '');
        } else {
            key = imageUrl;
        }

        const deleteParams = {
            Bucket: this.bucketName,
            Key: key,
        };

        try {
            await s3Client.send(new DeleteObjectCommand(deleteParams));
            return true;
        } catch (error) {
            console.error('R2 delete error:', error);
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    /**
     * Replace an existing image with a new one
     * @param {string} oldImageUrl - URL of image to replace
     * @param {Buffer} newFileBuffer - New file buffer
     * @param {string} newFileName - New file name
     * @param {string} newMimeType - New file MIME type
     * @param {string} folder - Folder path
     * @returns {string} New public URL
     */
    async replaceFile(oldImageUrl, newFileBuffer, newFileName, newMimeType, folder = 'products') {
        try {
            // Delete old file
            await this.deleteFile(oldImageUrl);

            // Upload new file
            const newUrl = await this.uploadFile(newFileBuffer, newFileName, newMimeType, folder);

            return newUrl;
        } catch (error) {
            console.error('R2 replace error:', error);
            throw new Error(`Failed to replace file: ${error.message}`);
        }
    }
}

module.exports = new R2Service();