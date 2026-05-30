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

const sortProducts = (items, sort) => {
  const list = [...items];
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
  items = sortProducts(items, query.sort);

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
    query.sort
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
};
