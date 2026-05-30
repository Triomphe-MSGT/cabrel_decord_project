const { v2: cloudinary } = require('cloudinary');

const isPlaceholder = (value) =>
  !value ||
  value.includes('<username>') ||
  value.includes('<db_password>') ||
  value.includes('xxxxx');

const parseCloudinaryUrl = () => {
  const url = process.env.CLOUDINARY_URL;
  if (!url || !url.startsWith('cloudinary://')) return null;
  try {
    const parsed = new URL(url);
    return {
      api_key: decodeURIComponent(parsed.username),
      api_secret: decodeURIComponent(parsed.password),
      cloud_name: parsed.hostname,
    };
  } catch {
    return null;
  }
};

const getCredentials = () => {
  const fromUrl = parseCloudinaryUrl();
  if (fromUrl) return fromUrl;

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (
    CLOUDINARY_CLOUD_NAME &&
    CLOUDINARY_API_KEY &&
    CLOUDINARY_API_SECRET &&
    !isPlaceholder(CLOUDINARY_CLOUD_NAME)
  ) {
    return {
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    };
  }
  return null;
};

const isCloudinaryConfigured = () => Boolean(getCredentials());

const configureCloudinary = () => {
  const creds = getCredentials();
  if (!creds) return false;

  cloudinary.config({ ...creds, secure: true });
  return true;
};

const uploadFolder = (subfolder = '') => {
  const base = process.env.CLOUDINARY_FOLDER || 'cabrel-decor';
  return subfolder ? `${base}/${subfolder}` : base;
};

module.exports = {
  cloudinary,
  configureCloudinary,
  isCloudinaryConfigured,
  uploadFolder,
  isMongoUriConfigured: () => {
    const uri = process.env.MONGO_URI;
    return Boolean(uri && !isPlaceholder(uri));
  },
};
