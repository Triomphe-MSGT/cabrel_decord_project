const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'contact', unique: true },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: 'contact@cabreldecor.com' },
    facebook: { type: String, default: '' },
    adresse: { type: String, default: 'Yaoundé, Cameroun' },
    horaires: { type: String, default: 'Lun – Sam · 9h – 18h' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
