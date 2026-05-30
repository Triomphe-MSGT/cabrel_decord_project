const mongoose = require('mongoose');

const featuredSectionSchema = new mongoose.Schema(
  {
    kicker: { type: String, default: 'Sélection du moment' },
    title: { type: String, default: 'À la une' },
    subtitle: { type: String, default: '' },
    maxItems: { type: Number, default: 6, min: 1, max: 12 },
    actif: { type: Boolean, default: true },
    ctaLabel: { type: String, default: 'Explorer le catalogue' },
    ctaLink: { type: String, default: '/mobilier' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeaturedSection', featuredSectionSchema);
