const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { cloudinary, isCloudinaryConfigured, uploadFolder } = require('../config/cloudinary');

const UPLOAD_ROOT = path.join(__dirname, '../uploads');

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Format non supporté (JPEG, PNG, WebP, GIF)'));
  },
});

const sanitizeFolder = (folder) =>
  String(folder || 'misc')
    .replace(/[^a-z0-9-_]/gi, '')
    .slice(0, 32) || 'misc';

const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: uploadFolder(folder), resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    stream.end(buffer);
  });

const uploadLocally = (buffer, originalname, folder) => {
  const subdir = path.join(UPLOAD_ROOT, folder);
  if (!fs.existsSync(subdir)) fs.mkdirSync(subdir, { recursive: true });
  const ext = path.extname(originalname).toLowerCase() || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
  fs.writeFileSync(path.join(subdir, filename), buffer);
  return `/uploads/${folder}/${filename}`;
};

const uploadImage = async (file, folder = 'misc') => {
  const safeFolder = sanitizeFolder(folder);
  if (isCloudinaryConfigured()) {
    return uploadToCloudinary(file.buffer, safeFolder);
  }
  if (process.env.VERCEL) {
    throw new Error('Cloudinary requis en production — configurez CLOUDINARY_URL sur Vercel');
  }
  return uploadLocally(file.buffer, file.originalname, safeFolder);
};

module.exports = { upload, uploadImage, sanitizeFolder };
