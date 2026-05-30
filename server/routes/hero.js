const express = require('express');
const { heroSlides } = require('../services/dataStore');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const slides = await heroSlides.findPublic();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', adminAuth, async (req, res) => {
  try {
    const slides = await heroSlides.findAll();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const slide = await heroSlides.create(req.body);
    res.status(201).json(slide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const slide = await heroSlides.update(req.params.id, req.body);
    if (!slide) return res.status(404).json({ message: 'Slide introuvable' });
    res.json(slide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const slide = await heroSlides.remove(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide introuvable' });
    res.json({ message: 'Slide supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
