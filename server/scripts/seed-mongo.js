/**
 * Importe server/data/db.json vers MongoDB Atlas.
 * Usage : cd server && npm run seed
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const HeroSlide = require('../models/HeroSlide');
const FeaturedSection = require('../models/FeaturedSection');
const Admin = require('../models/Admin');
const SiteSettings = require('../models/SiteSettings');

const DB_PATH = path.join(__dirname, '../data/db.json');

const seed = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI manquant dans server/.env');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connecté à MongoDB — import en cours…');

  await Product.deleteMany({});
  await Comment.deleteMany({});
  await HeroSlide.deleteMany({});
  await FeaturedSection.deleteMany({});
  await Admin.deleteMany({});
  await SiteSettings.deleteMany({});

  await Product.insertMany(data.products);
  await Comment.insertMany(data.comments);

  if (data.heroSlides?.length) {
    await HeroSlide.insertMany(data.heroSlides);
  }

  if (data.featuredSection) {
    await FeaturedSection.create(data.featuredSection);
  }

  if (data.admin) {
    const { _id, passwordHash, ...rest } = data.admin;
    await Admin.create({ ...rest, passwordHash });
  } else {
    await Admin.create({
      nom: 'Administrateur Cabrel',
      email: process.env.ADMIN_EMAIL || 'admin@cabreldecor.com',
      passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
    });
  }

  if (data.contact) {
    const { updatedAt, ...contact } = data.contact;
    await SiteSettings.create({ key: 'contact', ...contact });
  } else {
    await SiteSettings.create({
      key: 'contact',
      whatsapp: process.env.WHATSAPP_NUMBER || '',
      email: process.env.CONTACT_EMAIL || 'contact@cabreldecor.com',
      facebook: process.env.FACEBOOK_PAGE_ID || '',
    });
  }

  console.log(
    `Import terminé :
  · ${data.products.length} produits
  · ${data.comments.length} commentaires
  · ${data.heroSlides?.length || 0} slides hero
  · 1 section « À la une »
  · 1 compte admin
  · 1 fiche contact`
  );
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
