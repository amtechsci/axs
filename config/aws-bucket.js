const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: 'AKIA6NC7FWQ2RIQX6RXM',
  secretAccessKey: 'mWQkuYJhQ0G30VmWHaXEWLjGWMc6iSVrMhJl9X5b',
  region: 'ap-south-1' // e.g., 'us-west-2'
});

const s3 = new AWS.S3();

const fs = require('fs');

const uploadFile = (filePath, key, mimeType) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        reject(err);
        return;
      }

      const params = {
        Bucket: 'assetsaxs', // Replace with your bucket name
        Key: key,
        Body: fileContent,
        ContentType: mimeType,
        // ACL: 'public-read'
      };

      s3.upload(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  });
};

module.exports = { uploadFile };