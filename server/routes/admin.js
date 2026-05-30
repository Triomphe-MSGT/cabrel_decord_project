const express = require('express');
const jwt = require('jsonwebtoken');
const { products, comments } = require('../services/dataStore');
const { admin } = require('../services/adminService');
const { settings } = require('../services/settingsService');
const { upload, uploadImage } = require('../services/uploadService');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const signToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'dev_secret_json_mode';
  return jwt.sign(payload, secret, { expiresIn: '8h' });
};

router.post('/login', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const record = await admin.getForAuth();

    if (record) {
      if (record.email.toLowerCase() !== email) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
      const valid = await admin.verifyPassword(password, record.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
      const token = signToken({ role: 'admin', sub: record._id, email: record.email });
      const { passwordHash, ...profile } = record;
      return res.json({ token, admin: profile });
    }

    const envEmail = (process.env.ADMIN_EMAIL || 'admin@cabreldecor.com').toLowerCase();
    if (email !== envEmail || !admin.verifyEnvPassword(password)) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = signToken({ role: 'admin', email });
    return res.json({
      token,
      admin: { nom: 'Administrateur', email: envEmail },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/profile', adminAuth, async (req, res) => {
  try {
    const profile = await admin.getProfile();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/profile', adminAuth, async (req, res) => {
  try {
    const { nom, email, currentPassword, newPassword } = req.body;
    const record = await admin.getForAuth();

    if (!record) {
      return res.status(400).json({ message: 'Profil non modifiable en mode env seul' });
    }

    if (newPassword || email || nom) {
      const valid = await admin.verifyPassword(currentPassword, record.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
      }
    }

    const updates = {};
    if (nom !== undefined) updates.nom = nom;
    if (email !== undefined) updates.email = email;
    if (newPassword) updates.passwordHash = await admin.hashPassword(newPassword);

    const profile = await admin.updateProfile(updates);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/contact', adminAuth, async (_req, res) => {
  try {
    const contact = await settings.getContact();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/contact', adminAuth, async (req, res) => {
  try {
    const contact = await settings.updateContact(req.body);
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/upload', adminAuth, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image envoyée' });
    }
    const url = await uploadImage(req.file, req.body.folder);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [mobilier, art, pendingComments, allProducts] = await Promise.all([
      products.count({ atelier: 'mobilier' }),
      products.count({ atelier: 'art' }),
      comments.countPending(),
      products.findAll({}),
    ]);

    const list = Array.isArray(allProducts) ? allProducts : allProducts.products || [];
    const mobilierVedette = list.filter((p) => p.atelier === 'mobilier' && p.enVedette).length;
    const artVedette = list.filter((p) => p.atelier === 'art' && p.enVedette).length;

    res.json({
      mobilier,
      art,
      pendingComments,
      total: mobilier + art,
      mobilierVedette,
      artVedette,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
