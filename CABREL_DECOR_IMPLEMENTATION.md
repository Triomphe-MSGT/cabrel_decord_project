# 🪑🎨 Cabrel Décor — Guide d'implémentation complet

> Site vitrine React/Vite — Mobilier artisanal & Art décoratif  
> Stack : React + Vite · Tailwind CSS · React Router v6 · Node.js/Express · MongoDB Atlas

---

## Table des matières

1. [Structure du projet](#1-structure-du-projet)
2. [Installation & configuration](#2-installation--configuration)
3. [Base de données — MongoDB Atlas](#3-base-de-données--mongodb-atlas)
4. [Backend — API Express](#4-backend--api-express)
5. [Frontend — Pages & composants](#5-frontend--pages--composants)
6. [Fonctionnalités clés](#6-fonctionnalités-clés)
7. [Panel Admin](#7-panel-admin)
8. [Déploiement](#8-déploiement)
9. [Checklist finale](#9-checklist-finale)

---

## 1. Structure du projet

```
cabrel-decor/
├── client/                        # Frontend React + Vite
│   ├── public/
│   │   └── assets/                # Favicon, logo, images statiques
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── PageTransition.jsx
│   │   │   ├── ui/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ArtCard.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── FilterPanel.jsx
│   │   │   │   ├── PriceRange.jsx
│   │   │   │   ├── ContactButtons.jsx   # WhatsApp / Gmail / Facebook
│   │   │   │   ├── CommentForm.jsx
│   │   │   │   ├── CommentList.jsx
│   │   │   │   └── ImageGallery.jsx
│   │   │   └── home/
│   │   │       ├── Hero.jsx
│   │   │       ├── AtelierPreview.jsx
│   │   │       └── FeaturedItems.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Mobilier.jsx
│   │   │   ├── MobilierDetail.jsx
│   │   │   ├── Art.jsx
│   │   │   ├── ArtDetail.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       └── AdminComments.jsx
│   │   ├── hooks/
│   │   │   ├── useSearch.js
│   │   │   ├── useFilter.js
│   │   │   └── useProducts.js
│   │   ├── services/
│   │   │   └── api.js             # Axios — appels API centralisés
│   │   ├── context/
│   │   │   └── AdminContext.jsx
│   │   ├── utils/
│   │   │   ├── contactLinks.js    # Génération liens WhatsApp/Gmail/FB
│   │   │   └── formatPrice.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                        # Backend Node.js / Express
│   ├── models/
│   │   ├── Product.js             # Mobilier + Art (discriminator ou champ type)
│   │   └── Comment.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── comments.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── adminAuth.js           # Vérification token admin
│   ├── config/
│   │   └── db.js                  # Connexion MongoDB Atlas
│   ├── .env
│   └── index.js
│
├── .gitignore
└── README.md
```

---

## 2. Installation & configuration

### Prérequis
- Node.js ≥ 18
- Compte MongoDB Atlas (gratuit)
- Compte Cloudinary (images, optionnel)

### Initialisation

```bash
# Cloner / créer le projet
mkdir cabrel-decor && cd cabrel-decor

# --- Frontend ---
npm create vite@latest client -- --template react
cd client
npm install react-router-dom axios tailwindcss @tailwindcss/vite \
  framer-motion lucide-react react-image-gallery swiper

# Initialiser Tailwind
npx tailwindcss init -p

# --- Backend ---
cd ../
mkdir server && cd server
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken \
  express-validator multer cloudinary
npm install -D nodemon
```

### Variables d'environnement

**`server/.env`**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/cabrel-decor
JWT_SECRET=votre_secret_jwt_tres_long
ADMIN_PASSWORD=motdepasse_admin_securise

# Cloudinary (optionnel)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Contacts
WHATSAPP_NUMBER=237XXXXXXXXX
CONTACT_EMAIL=contact@cabreldecor.com
FACEBOOK_PAGE_ID=cabreldecor
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=237XXXXXXXXX
VITE_CONTACT_EMAIL=contact@cabreldecor.com
VITE_FACEBOOK_PAGE=cabreldecor
```

---

## 3. Base de données — MongoDB Atlas

### Schéma `Product`

```js
// server/models/Product.js
const productSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  atelier: { type: String, enum: ['mobilier', 'art'], required: true },

  // Mobilier
  categorie_mobilier: {
    type: String,
    enum: ['table', 'chaise', 'armoire', 'lit', 'canapé', 'étagère', 'autre'],
  },
  matiere: String,

  // Art
  categorie_art: {
    type: String,
    enum: ['tableau', 'peinture abstraite', 'portrait', 'paysage', 'autre'],
  },
  technique: String,     // ex : "Acrylique sur toile"
  dimensions: String,    // ex : "60 x 80 cm"

  // Commun
  prix: { type: Number, required: true, min: 0 },
  disponible: { type: Boolean, default: true },
  images: [String],      // URLs Cloudinary ou chemins locaux
  tags: [String],
  enVedette: { type: Boolean, default: false },   // Affiché en "À la une"

}, { timestamps: true });
```

### Schéma `Comment`

```js
// server/models/Comment.js
const commentSchema = new mongoose.Schema({
  produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  auteur: { type: String, required: true, trim: true, maxlength: 60 },
  contenu: { type: String, required: true, maxlength: 500 },
  note: { type: Number, min: 1, max: 5 },         // étoiles optionnelles
  valide: { type: Boolean, default: false },        // false = en attente admin
}, { timestamps: true });
```

---

## 4. Backend — API Express

### Routes produits (`/api/products`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/products` | Tous les produits (filtres via query params) | ❌ |
| GET | `/api/products/:id` | Détail d'un produit | ❌ |
| GET | `/api/products/search?q=` | Recherche globale | ❌ |
| POST | `/api/products` | Créer un produit | ✅ Admin |
| PUT | `/api/products/:id` | Modifier un produit | ✅ Admin |
| DELETE | `/api/products/:id` | Supprimer un produit | ✅ Admin |

**Query params disponibles sur GET `/api/products` :**
```
?atelier=mobilier|art
?categorie=table|chaise|...
?prixMin=0&prixMax=500000
?disponible=true
?enVedette=true
?q=recherche texte libre
?sort=prix_asc|prix_desc|recent
?page=1&limit=12
```

### Routes commentaires (`/api/comments`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/api/comments/:produitId` | Commentaires validés d'un produit | ❌ |
| POST | `/api/comments` | Soumettre un commentaire | ❌ |
| GET | `/api/comments/pending` | Tous les commentaires en attente | ✅ Admin |
| PUT | `/api/comments/:id/validate` | Valider un commentaire | ✅ Admin |
| DELETE | `/api/comments/:id` | Supprimer un commentaire | ✅ Admin |

### Authentification admin

```js
// POST /api/admin/login
// Body: { password: "..." }
// Retourne: { token: "JWT..." }
```

Le token JWT est stocké en mémoire côté client (`AdminContext`) — pas de localStorage pour limiter les risques XSS.

---

## 5. Frontend — Pages & composants

### Routing (`App.jsx`)

```jsx
<Routes>
  {/* Public */}
  <Route path="/" element={<Home />} />
  <Route path="/mobilier" element={<Mobilier />} />
  <Route path="/mobilier/:id" element={<MobilierDetail />} />
  <Route path="/art" element={<Art />} />
  <Route path="/art/:id" element={<ArtDetail />} />
  <Route path="/recherche" element={<SearchResults />} />

  {/* Admin */}
  <Route path="/admin" element={<AdminLogin />} />
  <Route path="/admin/dashboard" element={
    <ProtectedRoute><AdminDashboard /></ProtectedRoute>
  } />
  <Route path="/admin/produits" element={
    <ProtectedRoute><AdminProducts /></ProtectedRoute>
  } />
  <Route path="/admin/commentaires" element={
    <ProtectedRoute><AdminComments /></ProtectedRoute>
  } />
</Routes>
```

### Page Accueil — composants

```
Home.jsx
 ├── Hero.jsx
 │    └── SearchBar.jsx (recherche globale → /recherche?q=...)
 ├── AtelierPreview.jsx   (cards cliquables Mobilier / Art)
 └── FeaturedItems.jsx    (produits enVedette=true)
      └── ProductCard.jsx / ArtCard.jsx
```

### Fiche produit — composants

```
MobilierDetail.jsx / ArtDetail.jsx
 ├── ImageGallery.jsx      (swiper avec zoom)
 ├── Infos (titre, prix, description, catégorie, disponibilité)
 ├── ContactButtons.jsx    (WhatsApp / Gmail / Facebook)
 ├── CommentList.jsx       (commentaires validés)
 └── CommentForm.jsx       (formulaire + message "en attente de validation")
```

---

## 6. Fonctionnalités clés

### Recherche globale

```js
// hooks/useSearch.js
// Appelle GET /api/products?q=terme&page=1&limit=20
// Debounce 300ms avant envoi
// Résultats affichés dans SearchResults.jsx avec indication de l'atelier
```

### Filtres

```js
// hooks/useFilter.js
// État local : { atelier, categorie, prixMin, prixMax, disponible, sort }
// Reconstruit les query params à chaque changement
// Synchronisé avec l'URL via useSearchParams() pour partage de liens
```

### Boutons de contact (`ContactButtons.jsx`)

```js
// utils/contactLinks.js

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

export const getFacebookLink = (produit) => {
  return `https://m.me/${import.meta.env.VITE_FACEBOOK_PAGE}`;
};
```

### Commentaires — flux complet

```
Visiteur remplit CommentForm
        ↓
POST /api/comments  →  { valide: false }  →  MongoDB
        ↓
Message affiché : "Votre commentaire est en attente de validation."
        ↓
Admin voit le commentaire dans /admin/commentaires
        ↓
Admin valide  →  PUT /api/comments/:id/validate  →  { valide: true }
        ↓
Commentaire visible sur la fiche produit
```

---

## 7. Panel Admin

### Fonctionnalités

| Section | Actions |
|---------|---------|
| **Produits** | Ajouter / modifier / supprimer un produit, uploader images, marquer "en vedette" |
| **Commentaires** | Voir les commentaires en attente, valider, rejeter |
| **Stats rapides** | Nombre de produits par atelier, commentaires en attente |

### Sécurité admin (minimaliste)

- Login par mot de passe unique → JWT retourné (durée : 8h)
- Token stocké dans `AdminContext` (mémoire React, pas localStorage)
- Route `ProtectedRoute` vérifie le token avant affichage
- Toutes les routes `/api/admin/*` et mutations requièrent le header `Authorization: Bearer <token>`

---

## 8. Déploiement

### Option recommandée (gratuite)

| Couche | Service |
|--------|---------|
| Frontend | **Vercel** (déploiement auto depuis GitHub) |
| Backend | **Render** (free tier, Node.js) |
| Base de données | **MongoDB Atlas** (free tier M0) |
| Images | **Cloudinary** (free tier 25GB) |

### Configuration Vite pour le build

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'  // dev uniquement
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### Variables d'environnement en production

Sur Vercel → Settings → Environment Variables :
```
VITE_API_URL=https://cabrel-decor-api.onrender.com/api
VITE_WHATSAPP_NUMBER=237XXXXXXXXX
VITE_CONTACT_EMAIL=contact@cabreldecor.com
VITE_FACEBOOK_PAGE=cabreldecor
```

---

## 9. Checklist finale

### Backend
- [ ] Connexion MongoDB Atlas fonctionnelle
- [ ] Modèles `Product` et `Comment` créés
- [ ] Toutes les routes API testées (Postman ou Thunder Client)
- [ ] Middleware admin opérationnel
- [ ] CORS configuré pour l'URL du frontend en production

### Frontend
- [ ] Navigation entre toutes les pages fluide
- [ ] Recherche globale fonctionnelle avec debounce
- [ ] Filtres synchronisés avec l'URL
- [ ] Galerie images opérationnelle sur mobile et desktop
- [ ] Boutons WhatsApp / Gmail / Facebook testés avec vrais numéros/emails
- [ ] Formulaire commentaire : soumission + message de confirmation
- [ ] Responsive design validé (mobile, tablette, desktop)

### Admin
- [ ] Login admin sécurisé
- [ ] CRUD produits complet (avec upload d'images)
- [ ] Modération des commentaires (valider / rejeter)
- [ ] Marquage "en vedette" des produits

### Production
- [ ] Build Vite sans erreurs (`npm run build`)
- [ ] Variables d'environnement définies sur Vercel et Render
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Test complet sur mobile (WhatsApp, Gmail, Facebook)

---

## 📌 Ordre de développement recommandé

```
Phase 1 — Fondations (2-3 jours)
  → Setup MongoDB Atlas + modèles
  → API Express (routes produits)
  → Navbar + Footer + routing React

Phase 2 — Pages publiques (3-4 jours)
  → Accueil (Hero + AtelierPreview + Featured)
  → Pages Mobilier et Art (grille + filtres)
  → Fiches détail (galerie + infos + contact)

Phase 3 — Interactivité (2 jours)
  → Recherche globale
  → Filtres avec sync URL
  → Commentaires (soumission + affichage)

Phase 4 — Admin (2 jours)
  → Login admin
  → CRUD produits
  → Modération commentaires

Phase 5 — Finitions & déploiement (1-2 jours)
  → Responsive final
  → Animations / transitions
  → Déploiement Vercel + Render
```

---

*Document généré pour le projet Cabrel Décor — dernière mise à jour : Mai 2026*
