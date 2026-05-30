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
  { to: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/produits', label: 'Produits', icon: Package },
  { to: '/admin/hero', label: 'Bannière hero', icon: Image },
  { to: '/admin/featured', label: 'À la une', icon: Star },
  { to: '/admin/commentaires', label: 'Commentaires', icon: MessageSquare },
  { to: '/admin/contact', label: 'Contact', icon: Phone },
  { to: '/admin/profil', label: 'Mon profil', icon: User },
];

export const ADMIN_QUICK_ACTIONS = [
  {
    to: '/admin/produits?atelier=mobilier',
    label: 'Mobilier',
    desc: 'Catalogue atelier mobilier',
    icon: Package,
    primary: true,
  },
  {
    to: '/admin/produits?atelier=art',
    label: 'Art',
    desc: 'Catalogue atelier art',
    icon: Package,
  },
  {
    to: '/admin/contact',
    label: 'Contact',
    desc: 'WhatsApp, e-mail, Facebook',
    icon: Phone,
  },
  {
    to: '/admin/hero',
    label: 'Bannière hero',
    desc: 'Slides page d\'accueil',
    icon: Image,
  },
  {
    to: '/admin/featured',
    label: 'À la une',
    desc: 'Produits mis en avant',
    icon: Star,
  },
  {
    to: '/admin/commentaires',
    label: 'Commentaires',
    desc: 'Modérer les avis clients',
    icon: MessageSquare,
  },
];
