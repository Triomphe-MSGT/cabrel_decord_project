const mongoose = require('mongoose');

let jsonMode = false;

const isJsonMode = () => jsonMode;

const isPlaceholderUri = (uri) =>
  !uri ||
  uri.includes('<user>') ||
  uri.includes('<username>') ||
  uri.includes('<db_password>') ||
  uri.includes('xxxxx');

const isVercel = () => Boolean(process.env.VERCEL);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const forceJson =
    !isVercel() &&
    (process.env.USE_JSON_DB === 'true' || isPlaceholderUri(process.env.MONGO_URI));

  if (forceJson) {
    jsonMode = true;
    console.log('Mode JSON — données depuis server/data/db.json');
    return;
  }

  if (isVercel() && isPlaceholderUri(process.env.MONGO_URI)) {
    throw new Error('MONGO_URI manquant — configurez-le dans les variables Vercel');
  }

  if (cached.conn) {
    jsonMode = false;
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, { bufferCommands: false })
      .then((conn) => {
        jsonMode = false;
        console.log('MongoDB Atlas connecté');
        return conn;
      })
      .catch((err) => {
        cached.promise = null;
        if (isVercel()) {
          throw new Error(`MongoDB : ${err.message}`);
        }
        jsonMode = true;
        console.warn(`MongoDB indisponible (${err.message}), bascule sur db.json`);
        return null;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
module.exports.isJsonMode = isJsonMode;
