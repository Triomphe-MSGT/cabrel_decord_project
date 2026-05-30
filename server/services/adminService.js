const bcrypt = require('bcryptjs');
const jsonStore = require('./jsonStore');
const { isJsonMode } = require('../config/db');

let AdminModel = null;
const getAdminModel = () => {
  if (!AdminModel) AdminModel = require('../models/Admin');
  return AdminModel;
};

const sanitizeAdmin = (admin) => {
  if (!admin) return null;
  const { passwordHash, ...safe } = admin;
  return safe;
};

const ensureMongoAdmin = async () => {
  const Admin = getAdminModel();
  let record = await Admin.findOne().lean();
  if (record) return record;

  const now = new Date();
  record = await Admin.create({
    nom: 'Administrateur Cabrel',
    email: process.env.ADMIN_EMAIL || 'admin@cabreldecor.com',
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
    createdAt: now,
    updatedAt: now,
  });
  return record.toObject();
};

const admin = {
  getForAuth: async () => {
    if (isJsonMode()) return jsonStore.getAdminForAuth();
    return ensureMongoAdmin();
  },

  getProfile: async () => {
    if (isJsonMode()) return jsonStore.getAdminProfile();
    const record = await ensureMongoAdmin();
    return sanitizeAdmin(record);
  },

  updateProfile: async (data) => {
    if (isJsonMode()) return jsonStore.updateAdminProfile(data);
    const Admin = getAdminModel();
    const record = await ensureMongoAdmin();
    const updates = {};
    if (data.nom !== undefined) updates.nom = data.nom.trim();
    if (data.email !== undefined) updates.email = data.email.trim().toLowerCase();
    if (data.passwordHash) updates.passwordHash = data.passwordHash;
    const updated = await Admin.findByIdAndUpdate(record._id, updates, { new: true }).lean();
    return sanitizeAdmin(updated);
  },

  verifyPassword: async (plain, hash) => bcrypt.compare(plain, hash),

  hashPassword: async (plain) => bcrypt.hash(plain, 10),

  verifyEnvPassword: (password) =>
    Boolean(password && password === process.env.ADMIN_PASSWORD),
};

module.exports = { admin };
