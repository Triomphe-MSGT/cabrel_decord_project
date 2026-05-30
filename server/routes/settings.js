const express = require('express');
const { settings } = require('../services/settingsService');

const router = express.Router();

router.get('/contact', async (_req, res) => {
  try {
    const contact = await settings.getContact();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
