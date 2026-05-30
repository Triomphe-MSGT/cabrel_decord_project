const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    titre: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    atelier: { type: String, enum: ['mobilier', 'art'], required: true },
    categorie_mobilier: {
      type: String,
      enum: ['table', 'chaise', 'armoire', 'lit', 'canapé', 'étagère', 'autre'],
    },
    matiere: String,
    categorie_art: {
      type: String,
      enum: ['tableau', 'peinture abstraite', 'portrait', 'paysage', 'autre'],
    },
    technique: String,
    dimensions: String,
    prix: { type: Number, required: true, min: 0 },
    disponible: { type: Boolean, default: true },
    images: [String],
    tags: [String],
    enVedette: { type: Boolean, default: false },
    ordreVedette: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
