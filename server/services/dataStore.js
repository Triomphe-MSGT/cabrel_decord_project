const Product = require('../models/Product');
const Comment = require('../models/Comment');
const jsonStore = require('./jsonStore');
const { isJsonMode } = require('../config/db');

const getSort = (sort) => {
  switch (sort) {
    case 'prix_asc':
      return { prix: 1 };
    case 'prix_desc':
      return { prix: -1 };
    default:
      return { createdAt: -1 };
  }
};

const buildMongoFilter = (query) => {
  const filter = {};
  if (query.atelier) filter.atelier = query.atelier;
  if (query.disponible !== undefined) filter.disponible = query.disponible === 'true';
  if (query.enVedette === 'true') filter.enVedette = true;
  if (query.categorie) {
    filter.$or = [
      { categorie_mobilier: query.categorie },
      { categorie_art: query.categorie },
    ];
  }
  if (query.prixMin || query.prixMax) {
    filter.prix = {};
    if (query.prixMin) filter.prix.$gte = Number(query.prixMin);
    if (query.prixMax) filter.prix.$lte = Number(query.prixMax);
  }
  if (query.q) {
    const regex = new RegExp(query.q, 'i');
    filter.$or = [
      ...(filter.$or || []),
      { titre: regex },
      { description: regex },
      { tags: regex },
    ];
  }
  return filter;
};

const products = {
  findPaginated: async (query) => {
    if (isJsonMode()) return jsonStore.findProducts(query);
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Number(query.limit) || 12);
    const skip = (page - 1) * limit;
    const filter = buildMongoFilter(query);
    const [items, total] = await Promise.all([
      Product.find(filter).sort(getSort(query.sort)).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
    return { products: items, total, page, pages: Math.ceil(total / limit) || 1 };
  },

  findAll: async (query) => {
    if (isJsonMode()) return jsonStore.findAllProducts(query);
    const filter = buildMongoFilter(query);
    return Product.find(filter).sort(getSort(query.sort)).lean();
  },

  findById: async (id) => {
    if (isJsonMode()) return jsonStore.findProductById(id);
    return Product.findById(id).lean();
  },

  create: async (data) => {
    if (isJsonMode()) return jsonStore.createProduct(data);
    const doc = await Product.create(data);
    return doc.toObject();
  },

  update: async (id, data) => {
    if (isJsonMode()) return jsonStore.updateProduct(id, data);
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  },

  remove: async (id) => {
    if (isJsonMode()) return jsonStore.deleteProduct(id);
    return Product.findByIdAndDelete(id).lean();
  },

  count: async (filter) => {
    if (isJsonMode()) return jsonStore.countProducts(filter);
    const q = {};
    if (filter.atelier) q.atelier = filter.atelier;
    return Product.countDocuments(q);
  },
};

const comments = {
  findByProduct: async (produitId) => {
    if (isJsonMode()) return jsonStore.findCommentsByProduct(produitId);
    return Comment.find({ produit: produitId, valide: true })
      .sort({ createdAt: -1 })
      .lean();
  },

  findPending: async () => {
    if (isJsonMode()) return jsonStore.findPendingComments();
    return Comment.find({ valide: false })
      .populate('produit', 'titre atelier')
      .sort({ createdAt: -1 })
      .lean();
  },

  create: async (data) => {
    if (isJsonMode()) return jsonStore.createComment(data);
    const doc = await Comment.create({ ...data, valide: false });
    return doc.toObject();
  },

  validate: async (id) => {
    if (isJsonMode()) return jsonStore.validateComment(id);
    return Comment.findByIdAndUpdate(id, { valide: true }, { new: true }).lean();
  },

  remove: async (id) => {
    if (isJsonMode()) return jsonStore.deleteComment(id);
    return Comment.findByIdAndDelete(id).lean();
  },

  countPending: async () => {
    if (isJsonMode()) return jsonStore.countPendingComments();
    return Comment.countDocuments({ valide: false });
  },
};

module.exports = { products, comments };
