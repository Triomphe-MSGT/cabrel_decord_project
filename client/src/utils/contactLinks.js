const envFallback = {
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'contact@cabreldecor.com',
  facebook: import.meta.env.VITE_FACEBOOK_PAGE || '',
  adresse: 'Yaoundé, Cameroun',
  horaires: 'Lun – Sam · 9h – 18h',
};

export const mergeContact = (contact) => ({ ...envFallback, ...contact });

export const formatWhatsAppDisplay = (number) => {
  if (!number) return '';
  const clean = String(number).replace(/\D/g, '');
  if (clean.startsWith('237') && clean.length >= 12) {
    return `+237 ${clean.slice(3, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 8)} ${clean.slice(8, 10)} ${clean.slice(10, 12)}`;
  }
  return clean.startsWith('+') ? number : `+${clean}`;
};

export const getWhatsAppLink = (produit, contact) => {
  const c = mergeContact(contact);
  const msg = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par "${produit.titre}" (réf: ${produit._id}) affiché à ${produit.prix} FCFA sur Cabrel Décor.`
  );
  return c.whatsapp ? `https://wa.me/${c.whatsapp}?text=${msg}` : null;
};

export const getGeneralWhatsAppLink = (contact) => {
  const c = mergeContact(contact);
  const msg = encodeURIComponent(
    'Bonjour, je souhaite obtenir des informations sur vos produits Cabrel Décor et Meubles.'
  );
  return c.whatsapp ? `https://wa.me/${c.whatsapp}?text=${msg}` : null;
};

export const getGmailLink = (produit, contact) => {
  const c = mergeContact(contact);
  const subject = encodeURIComponent(`Intérêt pour : ${produit.titre}`);
  const body = encodeURIComponent(
    `Bonjour,\n\nJe souhaite obtenir plus d'informations sur "${produit.titre}" (réf: ${produit._id}).\n\nCordialement.`
  );
  return c.email ? `mailto:${c.email}?subject=${subject}&body=${body}` : null;
};

export const getGeneralEmailLink = (contact) => {
  const c = mergeContact(contact);
  const subject = encodeURIComponent("Demande d'information — Cabrel Décor");
  const body = encodeURIComponent(
    'Bonjour,\n\nJe souhaite obtenir des informations sur vos produits.\n\nCordialement.'
  );
  return `mailto:${c.email}?subject=${subject}&body=${body}`;
};

export const getFacebookLink = (contact) => {
  const c = mergeContact(contact);
  return c.facebook ? `https://m.me/${c.facebook}` : null;
};
