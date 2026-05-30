const jsonStore = require('./jsonStore');
const { isJsonMode } = require('../config/db');

let SiteSettingsModel = null;
const getSiteSettingsModel = () => {
  if (!SiteSettingsModel) SiteSettingsModel = require('../models/SiteSettings');
  return SiteSettingsModel;
};

const envContact = () => ({
  whatsapp: process.env.WHATSAPP_NUMBER || '',
  email: process.env.CONTACT_EMAIL || 'contact@cabreldecor.com',
  facebook: process.env.FACEBOOK_PAGE_ID || '',
  adresse: 'Yaoundé, Cameroun',
  horaires: 'Lun – Sam · 9h – 18h',
});

const ensureMongoContact = async () => {
  const SiteSettings = getSiteSettingsModel();
  let doc = await SiteSettings.findOne({ key: 'contact' }).lean();
  if (doc) {
    const { key, _id, __v, createdAt, updatedAt, ...contact } = doc;
    return contact;
  }
  const created = await SiteSettings.create({ key: 'contact', ...envContact() });
  const obj = created.toObject();
  const { key, _id, __v, createdAt, updatedAt, ...contact } = obj;
  return contact;
};

const settings = {
  getContact: async () => {
    if (isJsonMode()) return jsonStore.getContactSettings();
    return ensureMongoContact();
  },

  updateContact: async (data) => {
    if (isJsonMode()) return jsonStore.updateContactSettings(data);
    const SiteSettings = getSiteSettingsModel();
    const updated = await SiteSettings.findOneAndUpdate(
      { key: 'contact' },
      {
        whatsapp: String(data.whatsapp ?? '').replace(/\D/g, ''),
        email: String(data.email ?? '').trim().toLowerCase(),
        facebook: String(data.facebook ?? '').trim().replace(/^@/, ''),
        adresse: String(data.adresse ?? '').trim(),
        horaires: String(data.horaires ?? '').trim(),
      },
      { new: true, upsert: true, runValidators: true }
    ).lean();
    const { key, _id, __v, createdAt, updatedAt, ...contact } = updated;
    return contact;
  },
};

module.exports = { settings };
