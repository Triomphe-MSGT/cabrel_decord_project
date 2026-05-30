const express = require('express');
const { body, validationResult } = require('express-validator');
const { comments } = require('../services/dataStore');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/pending', adminAuth, async (req, res) => {
  try {
    const list = await comments.findPending();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:produitId', async (req, res) => {
  try {
    const list = await comments.findByProduct(req.params.produitId);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  '/',
  [
    body('produit').notEmpty(),
    body('auteur').trim().isLength({ min: 1, max: 60 }),
    body('contenu').trim().isLength({ min: 1, max: 500 }),
    body('note').optional().isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const comment = await comments.create(req.body);
      res.status(201).json(comment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.put('/:id/validate', adminAuth, async (req, res) => {
  try {
    const comment = await comments.validate(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Commentaire introuvable' });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const comment = await comments.remove(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Commentaire introuvable' });
    res.json({ message: 'Commentaire supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
