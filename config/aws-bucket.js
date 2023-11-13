const { S3Client } = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');

// Configure AWS SDK v3 S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION, // 'ap-south-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Ensure these are set in your environment
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Configure multer to use multer-s3 for uploading directly to S3
const upload = multer({
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Unsupported file type'), false);
    }
    cb(null, true);
  },
  storage: multerS3({
    s3: s3Client,
    bucket: 'assetsaxs',
    contentType: multerS3.AUTO_CONTENT_TYPE, // Auto-detect content type
    key: function (req, file, cb) {
      const key = `profile_images/${Date.now().toString()}-${file.originalname}`;
      cb(null, key);
    }
  })
});

module.exports = { upload };