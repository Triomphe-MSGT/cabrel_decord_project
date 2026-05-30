const express = require('express');
const { featured } = require('../services/dataStore');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await featured.getPublic();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/admin', adminAuth, async (req, res) => {
  try {
    const data = await featured.getAdmin();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/section', adminAuth, async (req, res) => {
  try {
    const section = await featured.updateSection(req.body);
    res.json(section);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/products', adminAuth, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'items doit être un tableau' });
    }
    const products = await featured.updateProducts(items);
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
