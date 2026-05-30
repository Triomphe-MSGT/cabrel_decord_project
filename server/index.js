require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { isJsonMode } = require('./config/db');

const productsRouter = require('./routes/products');
const commentsRouter = require('./routes/comments');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', dataSource: isJsonMode() ? 'json' : 'mongodb' });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Serveur Cabrel Décor sur le port ${PORT}`);
  });
};

start();
