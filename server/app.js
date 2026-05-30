require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { isJsonMode } = require('./config/db');
const { configureCloudinary, isCloudinaryConfigured } = require('./config/cloudinary');

const productsRouter = require('./routes/products');
const commentsRouter = require('./routes/comments');
const heroRouter = require('./routes/hero');
const featuredRouter = require('./routes/featured');
const adminRouter = require('./routes/admin');
const settingsRouter = require('./routes/settings');

const app = express();

let initialized = false;

const ensureReady = async () => {
  if (initialized) return;
  await connectDB();
  configureCloudinary();
  initialized = true;
};

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use(async (req, res, next) => {
  try {
    await ensureReady();
    next();
  } catch (err) {
    res.status(500).json({ message: `Initialisation serveur : ${err.message}` });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/products', productsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/hero', heroRouter);
app.use('/api/featured', featuredRouter);
app.use('/api/admin', adminRouter);
app.use('/api/settings', settingsRouter);

app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    dataSource: isJsonMode() ? 'json' : 'mongodb',
    cloudinary: isCloudinaryConfigured(),
    platform: process.env.VERCEL ? 'vercel' : 'node',
  });
});

module.exports = app;
