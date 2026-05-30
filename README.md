# Cabrel Décor

Site vitrine React/Vite — Mobilier artisanal & Art décoratif.

## Stack

- **Frontend** : React + Vite, Tailwind CSS, React Router v6/v7
- **Backend** : Node.js / Express, MongoDB Atlas

## Démarrage

```bash
# Backend
cd server
cp .env.example .env   # USE_JSON_DB=true par défaut (données fictives dans data/db.json)
npm run dev

# Plus tard : importer db.json dans MongoDB Atlas
# USE_JSON_DB=false + MONGO_URI renseigné → npm run seed

# Frontend (autre terminal)
cd client
cp .env.example .env
npm install
npm run dev
```

Le proxy Vite redirige `/api` vers `http://localhost:5000` en développement.

## Documentation

Voir [CABREL_DECOR_IMPLEMENTATION.md](./CABREL_DECOR_IMPLEMENTATION.md) pour le guide complet.
