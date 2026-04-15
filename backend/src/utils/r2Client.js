const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: 'auto', // Cloudflare R2 uses 'auto'
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY,
    },
});

module.exports = s3Client;