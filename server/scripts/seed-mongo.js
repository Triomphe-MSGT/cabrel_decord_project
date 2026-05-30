/**
 * Importe server/data/db.json vers MongoDB Atlas.
 * Usage : MONGO_URI=... node scripts/seed-mongo.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Comment = require('../models/Comment');

const DB_PATH = path.join(__dirname, '../data/db.json');

const seed = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI manquant dans .env');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  await mongoose.connect(process.env.MONGO_URI);

  await Product.deleteMany({});
  await Comment.deleteMany({});

  await Product.insertMany(data.products);
  await Comment.insertMany(data.comments);

  console.log(
    `Import terminé : ${data.products.length} produits, ${data.comments.length} commentaires`
  );
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
