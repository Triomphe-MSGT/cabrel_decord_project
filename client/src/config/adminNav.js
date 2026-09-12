import {
  LayoutDashboard,
  Package,
  Image,
  Star,
  MessageSquare,
  User,
  Phone,
} from 'lucide-react';

export const ADMIN_NAV = [
  { to: '/cdm/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/cdm/produits', label: 'Produits', icon: Package },
  { to: '/cdm/hero', label: 'Bannière hero', icon: Image },
  { to: '/cdm/featured', label: 'À la une', icon: Star },
  { to: '/cdm/commentaires', label: 'Commentaires', icon: MessageSquare },
  { to: '/cdm/contact', label: 'Contact', icon: Phone },
  { to: '/cdm/profil', label: 'Mon profil', icon: User },
];

export const ADMIN_QUICK_ACTIONS = [
  {
    to: '/cdm/produits?atelier=mobilier',
    label: 'Mobilier',
    desc: 'Catalogue atelier mobilier',
    icon: Package,
    primary: true,
  },
  {
    to: '/cdm/produits?atelier=art',
    label: 'Art',
    desc: 'Catalogue atelier art',
    icon: Package,
  },
  {
    to: '/cdm/contact',
    label: 'Contact',
    desc: 'WhatsApp, e-mail, Facebook',
    icon: Phone,
  },
  {
    to: '/cdm/hero',
    label: 'Bannière hero',
    desc: 'Slides page d\'accueil',
    icon: Image,
  },
  {
    to: '/cdm/featured',
    label: 'À la une',
    desc: 'Produits mis en avant',
    icon: Star,
  },
  {
    to: '/cdm/commentaires',
    label: 'Commentaires',
    desc: 'Modérer les avis clients',
    icon: MessageSquare,
  },
];
