const express = require('express');
const jwt = require('jsonwebtoken');
const { products, comments } = require('../services/dataStore');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Mot de passe incorrect' });
  }

  const secret = process.env.JWT_SECRET || 'dev_secret_json_mode';
  const token = jwt.sign({ role: 'admin' }, secret, { expiresIn: '8h' });
  res.json({ token });
});

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [mobilier, art, pendingComments] = await Promise.all([
      products.count({ atelier: 'mobilier' }),
      products.count({ atelier: 'art' }),
      comments.countPending(),
    ]);
    res.json({ mobilier, art, pendingComments, total: mobilier + art });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
