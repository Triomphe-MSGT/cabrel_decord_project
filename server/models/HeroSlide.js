const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    mainImage: { type: String, required: true },
    insetImage: { type: String, default: '' },
    kicker: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    badge: { type: String, default: '' },
    ctaLabel: { type: String, required: true, trim: true },
    ctaLink: { type: String, required: true, trim: true },
    ordre: { type: Number, default: 0 },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
