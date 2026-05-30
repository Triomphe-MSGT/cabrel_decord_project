const Product = require('../models/Product');
const Comment = require('../models/Comment');
const HeroSlide = require('../models/HeroSlide');
const FeaturedSection = require('../models/FeaturedSection');
const jsonStore = require('./jsonStore');
const { isJsonMode } = require('../config/db');

const newId = (prefix) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

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
    const sort =
      query.enVedette === 'true' || query.enVedette === true
        ? { ordreVedette: 1, createdAt: -1 }
        : getSort(query.sort);
    const [items, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
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
    const { _id, createdAt, updatedAt, ...rest } = data;
    const doc = await Product.create({ ...rest, _id: _id || newId('prod') });
    return doc.toObject();
  },

  update: async (id, data) => {
    if (isJsonMode()) return jsonStore.updateProduct(id, data);
    const { _id, createdAt, updatedAt, ...rest } = data;
    return Product.findByIdAndUpdate(id, rest, { new: true, runValidators: true }).lean();
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

const heroSlides = {
  findPublic: async () => {
    if (isJsonMode()) return jsonStore.findHeroSlides(true);
    return HeroSlide.find({ actif: true }).sort({ ordre: 1, createdAt: 1 }).lean();
  },

  findAll: async () => {
    if (isJsonMode()) return jsonStore.findHeroSlides(false);
    return HeroSlide.find().sort({ ordre: 1, createdAt: 1 }).lean();
  },

  findById: async (id) => {
    if (isJsonMode()) return jsonStore.findHeroSlideById(id);
    return HeroSlide.findById(id).lean();
  },

  create: async (data) => {
    if (isJsonMode()) return jsonStore.createHeroSlide(data);
    const { _id, createdAt, updatedAt, ...rest } = data;
    const doc = await HeroSlide.create({ ...rest, _id: _id || newId('hero') });
    return doc.toObject();
  },

  update: async (id, data) => {
    if (isJsonMode()) return jsonStore.updateHeroSlide(id, data);
    const { _id, createdAt, updatedAt, ...rest } = data;
    return HeroSlide.findByIdAndUpdate(id, rest, { new: true, runValidators: true }).lean();
  },

  remove: async (id) => {
    if (isJsonMode()) return jsonStore.deleteHeroSlide(id);
    return HeroSlide.findByIdAndDelete(id).lean();
  },
};

const featured = {
  getPublic: async () => {
    if (isJsonMode()) {
      const section = jsonStore.getFeaturedSection();
      if (section.actif === false) return { section, products: [] };
      return { section, products: jsonStore.findFeaturedProducts() };
    }
    const sectionDoc = await FeaturedSection.findOne().lean();
    const section = sectionDoc || {
      kicker: 'Sélection du moment',
      title: 'À la une',
      subtitle: 'Passez le curseur sur un produit pour découvrir une autre vue ou sa mise en scène.',
      maxItems: 6,
      actif: true,
      ctaLabel: 'Explorer le catalogue',
      ctaLink: '/mobilier',
    };
    if (section.actif === false) return { section, products: [] };
    const max = Math.min(12, Number(section.maxItems) || 6);
    const products = await Product.find({ enVedette: true })
      .sort({ ordreVedette: 1, createdAt: -1 })
      .limit(max)
      .lean();
    return { section, products };
  },

  getAdmin: async () => {
    if (isJsonMode()) {
      return {
        section: jsonStore.getFeaturedSection(),
        featured: jsonStore.findFeaturedProducts(),
        all: jsonStore.findAllProducts({}),
      };
    }
    const sectionDoc = await FeaturedSection.findOne().lean();
    const section = sectionDoc || {
      kicker: 'Sélection du moment',
      title: 'À la une',
      subtitle: '',
      maxItems: 6,
      actif: true,
      ctaLabel: 'Explorer le catalogue',
      ctaLink: '/mobilier',
    };
    const [featuredProducts, all] = await Promise.all([
      Product.find({ enVedette: true }).sort({ ordreVedette: 1 }).lean(),
      Product.find().sort({ createdAt: -1 }).lean(),
    ]);
    return { section, featured: featuredProducts, all };
  },

  updateSection: async (data) => {
    if (isJsonMode()) return jsonStore.updateFeaturedSection(data);
    const updated = await FeaturedSection.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      runValidators: true,
    }).lean();
    return updated;
  },

  updateProducts: async (items) => {
    if (isJsonMode()) return jsonStore.updateFeaturedProducts(items);
    await Promise.all(
      items.map(({ _id, enVedette, ordreVedette }) =>
        Product.findByIdAndUpdate(_id, { enVedette, ordreVedette }, { new: true })
      )
    );
    return Product.find({ enVedette: true }).sort({ ordreVedette: 1 }).lean();
  },
};

module.exports = { products, comments, heroSlides, featured };
