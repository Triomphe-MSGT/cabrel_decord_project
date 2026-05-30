const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    produit: { type: String, ref: 'Product', required: true },
    auteur: { type: String, required: true, trim: true, maxlength: 60 },
    contenu: { type: String, required: true, maxlength: 500 },
    note: { type: Number, min: 1, max: 5 },
    valide: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
