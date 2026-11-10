const { S3Client } = require('@aws-sdk/client-s3');

const R2_ENDPOINT = process.env.R2_ENDPOINT || 'https://9d6eab3db906ef0c5c35a63dd57fc68a.r2.cloudflarestorage.com';
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY || 'aebfd2a1ecc0f5a2c34af90a0af9d50d';
const R2_SECRET_KEY = process.env.R2_SECRET_KEY || 'b8d5b84d3f50b0a31f5a47e0499d4a1545d6b4a4c83df504c22abde0f2bf6522';

const s3Client = new S3Client({
    region: 'auto', // Cloudflare R2 uses 'auto'
    endpoint: R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY,
        secretAccessKey: R2_SECRET_KEY,
    },
});

module.exports = s3Client;