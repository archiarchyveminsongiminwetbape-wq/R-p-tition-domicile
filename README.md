# Répétitions à Domicile — Application Web Complète

Plateforme full-stack de mise en relation entre **professeurs** et **parents** pour les cours particuliers à domicile, avec authentification Auth0.

---

## 🚀 Démarrage rapide

### Frontend
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production → /dist
```

### Backend API
```bash
cd server
npm install
cp .env.example .env  # Configurer la base de données
npm start             # http://localhost:3000/api
```

### Lancer les deux simultanément
```bash
npm run dev:all       # Frontend + Backend
```

---

## 🗂️ Structure complète

```
repetitions-domicile/
├── .env                        ← variables Auth0 (ne pas commiter)
├── .env.local                  ← URL API backend
├── AUTH0_SETUP.md              ← guide de configuration Auth0
├── index.html
├── package.json
├── vite.config.js
├── repetitions_domicile.sql    ← schéma base de données
├── public/favicon.svg
├── server/                     ← Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     ← connexion MySQL
│   │   ├── models/             ← Models (Professeur, Seance, Eleve, Annonce)
│   │   ├── controllers/        ├── Contrôleurs API
│   │   ├── routes/             ← Routes Express
│   │   └── server.js          ← Point d'entrée
│   ├── package.json
│   └── .env.example           ← Configuration serveur
└── src/
    ├── main.jsx                ← Auth0Provider + BrowserRouter
    ├── App.jsx                 ← Routes protégées
    ├── index.css               ← styles globaux
    ├── services/
    │   └── api.js              ← Client API
    ├── auth/
    │   └── config.js           ← constantes Auth0
    ├── hooks/
    │   ├── useRole.js          ← lecture du rôle depuis le token
    │   ├── useResponsive.js    ← détection mobile/tablette
    │   └── useApi.js           ← hook API custom
    ├── data/
    │   └── constants.js        ← données démo + référentiel
    ├── components/
    │   ├── Sidebar.jsx         ← nav avec user Auth0 réel
    │   ├── ProtectedRoute.jsx  ← garde de route par rôle
    │   ├── ReservModal.jsx     ← modal réservation + paiement
    │   ├── Avatar.jsx
    │   ├── Badge.jsx
    │   ├── Stars.jsx
    │   ├── StatutBadge.jsx
    │   └── Card.jsx
    └── pages/
        ├── Landing.jsx         ← page d'accueil publique
        ├── Login.jsx           ← connexion (email + Google)
        ├── Register.jsx        ← inscription avec choix du rôle
        ├── Callback.jsx        ← retour Auth0
        ├── RoleSelection.jsx   ← choix du rôle (OAuth Google)
        ├── Dashboard.jsx       ← tableau de bord (prof/parent)
        ├── Recherche.jsx       ← recherche + réservation (parent)
        ├── Seances.jsx         ← gestion des séances
        ├── Annonces.jsx        ← CRUD annonces (prof)
        ├── Eleves.jsx          ← gestion des élèves (parent)
        ├── Revenus.jsx         ← suivi revenus + graphique (prof)
        ├── Paiements.jsx       ← historique paiements (parent)
        └── Profil.jsx          ← profil éditable + sécurité
```

---

## 🔐 Flux d'authentification

| Scénario | Flux |
|---|---|
| Inscription email | Formulaire → `/dbconnections/signup` → Auth0 Login → `/callback` → `/app` |
| Inscription Google | Choix rôle → OAuth Google → `/callback` → `/choisir-role` → `/app` |
| Connexion | Auth0 Login → `/callback` → `/app` |
| Token expiré | Refresh automatique (localstorage) |

---

## 👤 Rôles et espaces

| Rôle | Pages accessibles |
|---|---|
| **Parent** | Dashboard, Rechercher un prof, Séances, Mes élèves, Paiements, Profil |
| **Professeur** | Dashboard, Mes annonces, Mes séances, Mes revenus, Profil |

---

## 🛠️ Stack

### Frontend
- **Framework** : React 18 + Vite 5
- **Authentification** : Auth0 (@auth0/auth0-react)
- **Routing** : React Router v6
- **HTTP Client** : Fetch API

### Backend
- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : MySQL 8
- **ORM** : mysql2 (promises)

### Base de données
- **MySQL 8** (voir `repetitions_domicile.sql`)

---

## 📋 Configuration Auth0 requise

Voir **AUTH0_SETUP.md** pour les instructions détaillées, notamment :
1. Paramétrer les URLs de callback/logout dans le dashboard Auth0
2. Créer l'**Action Post-Login** qui injecte le rôle dans le token JWT
3. Activer la connexion Google

---

*Application réalisée avec React 18 + Auth0 — Mai 2026*
