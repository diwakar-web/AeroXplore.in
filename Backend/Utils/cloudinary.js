const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'aeroxplore',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

/**
 * Upload an image buffer directly to Cloudinary using upload_stream
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Destination folder in Cloudinary
 * @returns {Promise<{ url: string, public_id: string }>}
 */
const uploadStream = (buffer, folder = 'aeroxplore/articles') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary credentials are not configured, fallback gracefully to a data URI or placeholder
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary credentials not detected in .env. Falling back to data URI.');
      const base64 = buffer.toString('base64');
      const dataUri = `data:image/jpeg;base64,${base64}`;
      return resolve({
        url: dataUri,
        public_id: `local_${Date.now()}`,
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream upload error:', error);
          return reject(error);
        }
        resolve({
          url: result.secure_url || result.url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
};

module.exports = { cloudinary, uploadStream };
