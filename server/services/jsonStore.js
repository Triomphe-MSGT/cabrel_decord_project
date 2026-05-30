const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

let cache = null;

const load = () => {
  if (!cache) {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    cache = JSON.parse(raw);
  }
  return cache;
};

const save = () => {
  fs.writeFileSync(DB_PATH, JSON.stringify(cache, null, 2), 'utf-8');
};

const matchesQuery = (product, query) => {
  if (query.atelier && product.atelier !== query.atelier) return false;
  if (query.disponible !== undefined && product.disponible !== (query.disponible === 'true')) {
    return false;
  }
  if (query.enVedette === 'true' && !product.enVedette) return false;

  if (query.categorie) {
    const cat = product.categorie_mobilier || product.categorie_art;
    if (cat !== query.categorie) return false;
  }

  if (query.prixMin && product.prix < Number(query.prixMin)) return false;
  if (query.prixMax && product.prix > Number(query.prixMax)) return false;

  if (query.q) {
    const q = query.q.toLowerCase();
    const haystack = [
      product.titre,
      product.description,
      ...(product.tags || []),
    ]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  return true;
};

const sortProducts = (items, sort, query = {}) => {
  const list = [...items];
  if (query.enVedette === 'true' || query.enVedette === true) {
    return list.sort((a, b) => (a.ordreVedette ?? 99) - (b.ordreVedette ?? 99));
  }
  switch (sort) {
    case 'prix_asc':
      return list.sort((a, b) => a.prix - b.prix);
    case 'prix_desc':
      return list.sort((a, b) => b.prix - a.prix);
    default:
      return list.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }
};

const newId = (prefix) => `${prefix}_${Date.now()}`;

const populateProduct = (produitId) => {
  const db = load();
  const p = db.products.find((x) => x._id === produitId);
  return p ? { _id: p._id, titre: p.titre, atelier: p.atelier } : produitId;
};

// --- Produits ---

const findProducts = (query = {}) => {
  const db = load();
  let items = db.products.filter((p) => matchesQuery(p, query));
  items = sortProducts(items, query.sort, query);

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Number(query.limit) || 12);
  const total = items.length;
  const skip = (page - 1) * limit;

  return {
    products: items.slice(skip, skip + limit),
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
  };
};

const findAllProducts = (query = {}) => {
  const db = load();
  const items = sortProducts(
    db.products.filter((p) => matchesQuery(p, query)),
    query.sort,
    query
  );
  return items;
};

const findProductById = (id) => load().products.find((p) => p._id === id) || null;

const createProduct = (data) => {
  const db = load();
  const now = new Date().toISOString();
  const product = {
    _id: newId('prod'),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  db.products.push(product);
  save();
  return product;
};

const updateProduct = (id, data) => {
  const db = load();
  const idx = db.products.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  db.products[idx] = {
    ...db.products[idx],
    ...data,
    _id: id,
    updatedAt: new Date().toISOString(),
  };
  save();
  return db.products[idx];
};

const deleteProduct = (id) => {
  const db = load();
  const idx = db.products.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  const [removed] = db.products.splice(idx, 1);
  db.comments = db.comments.filter((c) => c.produit !== id);
  save();
  return removed;
};

const countProducts = (filter = {}) =>
  load().products.filter((p) => matchesQuery(p, filter)).length;

// --- Commentaires ---

const findCommentsByProduct = (produitId) =>
  load()
    .comments.filter((c) => c.produit === produitId && c.valide)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const findPendingComments = () =>
  load()
    .comments.filter((c) => !c.valide)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((c) => ({
      ...c,
      produit: populateProduct(c.produit),
    }));

const createComment = (data) => {
  const db = load();
  const now = new Date().toISOString();
  const comment = {
    _id: newId('comm'),
    ...data,
    valide: false,
    createdAt: now,
    updatedAt: now,
  };
  db.comments.push(comment);
  save();
  return comment;
};

const validateComment = (id) => {
  const db = load();
  const c = db.comments.find((x) => x._id === id);
  if (!c) return null;
  c.valide = true;
  c.updatedAt = new Date().toISOString();
  save();
  return c;
};

const deleteComment = (id) => {
  const db = load();
  const idx = db.comments.findIndex((c) => c._id === id);
  if (idx === -1) return null;
  const [removed] = db.comments.splice(idx, 1);
  save();
  return removed;
};

const countPendingComments = () => load().comments.filter((c) => !c.valide).length;

const sortHeroSlides = (slides) =>
  [...slides].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));

const findHeroSlides = (activeOnly = true) => {
  const db = load();
  let slides = db.heroSlides || [];
  if (activeOnly) slides = slides.filter((s) => s.actif !== false);
  return sortHeroSlides(slides);
};

const findHeroSlideById = (id) => {
  const db = load();
  return (db.heroSlides || []).find((s) => s._id === id) || null;
};

const createHeroSlide = (data) => {
  const db = load();
  if (!db.heroSlides) db.heroSlides = [];
  const now = new Date().toISOString();
  const slide = {
    _id: newId('hero'),
    actif: true,
    ordre: db.heroSlides.length + 1,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  db.heroSlides.push(slide);
  save();
  return slide;
};

const updateHeroSlide = (id, data) => {
  const db = load();
  if (!db.heroSlides) return null;
  const idx = db.heroSlides.findIndex((s) => s._id === id);
  if (idx === -1) return null;
  db.heroSlides[idx] = {
    ...db.heroSlides[idx],
    ...data,
    _id: id,
    updatedAt: new Date().toISOString(),
  };
  save();
  return db.heroSlides[idx];
};

const deleteHeroSlide = (id) => {
  const db = load();
  if (!db.heroSlides) return null;
  const idx = db.heroSlides.findIndex((s) => s._id === id);
  if (idx === -1) return null;
  const [removed] = db.heroSlides.splice(idx, 1);
  save();
  return removed;
};

const DEFAULT_FEATURED_SECTION = {
  kicker: 'Sélection du moment',
  title: 'À la une',
  subtitle: 'Passez le curseur sur un produit pour découvrir une autre vue ou sa mise en scène.',
  maxItems: 6,
  actif: true,
  ctaLabel: 'Explorer le catalogue',
  ctaLink: '/mobilier',
};

const getFeaturedSection = () => {
  const db = load();
  return { ...DEFAULT_FEATURED_SECTION, ...(db.featuredSection || {}) };
};

const updateFeaturedSection = (data) => {
  const db = load();
  const now = new Date().toISOString();
  const maxItems = Math.min(12, Math.max(1, Number(data.maxItems) || 6));
  db.featuredSection = {
    ...getFeaturedSection(),
    ...data,
    maxItems,
    updatedAt: now,
  };
  save();
  return db.featuredSection;
};

const findFeaturedProducts = () => {
  const db = load();
  const { maxItems } = getFeaturedSection();
  const max = Math.min(12, Number(maxItems) || 6);
  return db.products
    .filter((p) => p.enVedette)
    .sort((a, b) => (a.ordreVedette ?? 99) - (b.ordreVedette ?? 99))
    .slice(0, max);
};

const updateFeaturedProducts = (items) => {
  const db = load();
  const now = new Date().toISOString();
  items.forEach(({ _id, enVedette, ordreVedette }) => {
    const idx = db.products.findIndex((p) => p._id === _id);
    if (idx === -1) return;
    if (enVedette !== undefined) db.products[idx].enVedette = enVedette;
    if (ordreVedette !== undefined) db.products[idx].ordreVedette = ordreVedette;
    db.products[idx].updatedAt = now;
  });
  save();
  return findFeaturedProducts();
};

const sanitizeAdmin = (admin) => {
  if (!admin) return null;
  const { passwordHash, ...safe } = admin;
  return safe;
};

const ensureAdmin = () => {
  const bcrypt = require('bcryptjs');
  const db = load();
  if (!db.admin) {
    const now = new Date().toISOString();
    db.admin = {
      _id: 'admin_001',
      nom: 'Administrateur',
      email: process.env.ADMIN_EMAIL || 'admin@cabreldecor.com',
      passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
      createdAt: now,
      updatedAt: now,
    };
    save();
  }
  return db.admin;
};

const getAdminProfile = () => sanitizeAdmin(ensureAdmin());

const getAdminForAuth = () => ensureAdmin();

const updateAdminProfile = ({ nom, email, passwordHash }) => {
  const db = load();
  ensureAdmin();
  if (nom !== undefined) db.admin.nom = nom.trim();
  if (email !== undefined) db.admin.email = email.trim().toLowerCase();
  if (passwordHash) db.admin.passwordHash = passwordHash;
  db.admin.updatedAt = new Date().toISOString();
  save();
  return sanitizeAdmin(db.admin);
};

const DEFAULT_CONTACT = {
  whatsapp: process.env.WHATSAPP_NUMBER || '',
  email: process.env.CONTACT_EMAIL || 'contact@cabreldecor.com',
  facebook: process.env.FACEBOOK_PAGE_ID || '',
  adresse: 'Yaoundé, Cameroun',
  horaires: 'Lun – Sam · 9h – 18h',
};

const getContactSettings = () => {
  const db = load();
  return { ...DEFAULT_CONTACT, ...(db.contact || {}) };
};

const updateContactSettings = (data) => {
  const db = load();
  const now = new Date().toISOString();
  db.contact = {
    ...getContactSettings(),
    whatsapp: String(data.whatsapp ?? '').replace(/\D/g, ''),
    email: String(data.email ?? '').trim().toLowerCase(),
    facebook: String(data.facebook ?? '').trim().replace(/^@/, ''),
    adresse: String(data.adresse ?? '').trim(),
    horaires: String(data.horaires ?? '').trim(),
    updatedAt: now,
  };
  save();
  return db.contact;
};

module.exports = {
  findProducts,
  findAllProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  countProducts,
  findCommentsByProduct,
  findPendingComments,
  createComment,
  validateComment,
  deleteComment,
  countPendingComments,
  findHeroSlides,
  findHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getFeaturedSection,
  updateFeaturedSection,
  findFeaturedProducts,
  updateFeaturedProducts,
  getAdminProfile,
  getAdminForAuth,
  updateAdminProfile,
  getContactSettings,
  updateContactSettings,
};
