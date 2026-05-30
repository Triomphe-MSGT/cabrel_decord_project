export const MOBILIER_CATEGORIES = ['table', 'chaise', 'armoire', 'lit', 'canapé', 'étagère', 'autre'];
export const ART_CATEGORIES = ['tableau', 'peinture abstraite', 'portrait', 'paysage', 'autre'];

export const ATELIER_CONFIG = {
  mobilier: {
    title: 'Atelier Mobilier',
    headline: 'Mobilier artisanal',
    description:
      'Pièces en bois noble, façonnées à la main pour des intérieurs chaleureux et durables.',
    hint: 'Survolez une image pour découvrir le meuble en situation.',
    heroImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80',
    categories: MOBILIER_CATEGORIES,
    crossLink: { to: '/art', label: "Explorer l'atelier Art" },
    productLabel: 'produit',
    emptyTitle: 'Aucun meuble ne correspond',
    emptyText: 'Essayez d’élargir vos filtres ou parcourez toute la collection.',
  },
  art: {
    title: 'Atelier Art',
    headline: 'Art décoratif',
    description:
      'Tableaux, portraits et œuvres originales pour habiller vos murs avec caractère.',
    hint: 'Survolez une image pour voir l’œuvre dans un intérieur.',
    heroImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1600&q=80',
    categories: ART_CATEGORIES,
    crossLink: { to: '/mobilier', label: "Explorer l'atelier Mobilier" },
    productLabel: 'œuvre',
    emptyTitle: 'Aucune œuvre ne correspond',
    emptyText: 'Modifiez vos critères ou découvrez l’ensemble de la galerie.',
  },
};

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus récent' },
  { value: 'prix_asc', label: 'Prix croissant' },
  { value: 'prix_desc', label: 'Prix décroissant' },
];

export const DISPONIBILITE_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'true', label: 'Disponible' },
  { value: 'false', label: 'Indisponible' },
];
