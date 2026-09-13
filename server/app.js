require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

// Security middleware
app.use(helmet());
// CORS with restricted origin
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin, credentials: true }));
// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Trop de requêtes provenant de cette IP, veuillez réessayer plus tard.',
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '10mb' }));

app.use(async (req, res, next) => {
  try {
    await ensureReady();
    next();
  } catch (err) {
    res.status(500).json({ message: `Initialisation serveur : ${err.message}` });
  }
});

const ensureReady = async () => {
  if (initialized) return;
  await connectDB();
  configureCloudinary();
  initialized = true;
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/products', productsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/hero', heroRouter);
app.use('/api/featured', featuredRouter);
app.use('/api/cdm', adminRouter);
app.use('/api/settings', settingsRouter);

app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    dataSource: isJsonMode() ? 'json' : 'mongodb',
    cloudinary: isCloudinaryConfigured(),
    platform: process.env.VERCEL ? 'vercel' : 'node',
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Erreur interne du serveur'
      : err.message;
  res.status(status).json({ message });
});

module.exports = app;