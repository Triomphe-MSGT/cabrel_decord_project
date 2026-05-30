const mongoose = require('mongoose');

let jsonMode = false;

const isJsonMode = () => jsonMode;

const connectDB = async () => {
  const forceJson =
    process.env.USE_JSON_DB === 'true' ||
    !process.env.MONGO_URI ||
    process.env.MONGO_URI.includes('<user>');

  if (forceJson) {
    jsonMode = true;
    console.log('Mode JSON — données depuis server/data/db.json');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    jsonMode = false;
    console.log('MongoDB Atlas connecté');
  } catch (err) {
    jsonMode = true;
    console.warn(`MongoDB indisponible (${err.message}), bascule sur db.json`);
  }
};

module.exports = connectDB;
module.exports.isJsonMode = isJsonMode;
