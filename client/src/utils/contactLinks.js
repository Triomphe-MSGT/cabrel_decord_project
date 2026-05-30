export const getWhatsAppLink = (produit) => {
  const msg = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par "${produit.titre}" (réf: ${produit._id}) affiché à ${produit.prix} FCFA sur Cabrel Décor.`
  );
  return `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${msg}`;
};

export const getGmailLink = (produit) => {
  const subject = encodeURIComponent(`Intérêt pour : ${produit.titre}`);
  const body = encodeURIComponent(
    `Bonjour,\n\nJe souhaite obtenir plus d'informations sur "${produit.titre}" (réf: ${produit._id}).\n\nCordialement.`
  );
  return `mailto:${import.meta.env.VITE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
};

export const getFacebookLink = () => {
  return `https://m.me/${import.meta.env.VITE_FACEBOOK_PAGE}`;
};
