# Backend API - Répétitions à Domicile

Serveur Node.js/Express pour l'application Répétitions à Domicile.

## 🚀 Installation

```bash
cd server
npm install
```

## ⚙️ Configuration

1. Copier le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

2. Éditer le fichier `.env` avec vos configuration :
```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=repetitions_domicile
DB_PORT=3306
```

## 🗄️ Base de données

Importez le fichier SQL situé à la racine du projet :
```bash
mysql -u root -p repetitions_domicile < ../repetitions_domicile.sql
```

## 🏃 Démarrage

**Mode développement :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

## 📡 API Endpoints

### Professeurs
- `GET /api/professeurs` - Liste tous les professeurs
- `GET /api/professeurs/:id` - Récupère un professeur
- `POST /api/professeurs` - Crée un professeur
- `PUT /api/professeurs/:id` - Met à jour un professeur
- `DELETE /api/professeurs/:id` - Supprime un professeur

### Séances
- `GET /api/seances` - Liste toutes les séances
- `GET /api/seances/:id` - Récupère une séance
- `GET /api/seances/professeur/:profId` - Séances d'un professeur
- `GET /api/seances/parent/:parentId` - Séances d'un parent
- `POST /api/seances` - Crée une séance
- `PUT /api/seances/:id` - Met à jour une séance
- `PATCH /api/seances/:id/statut` - Met à jour le statut
- `DELETE /api/seances/:id` - Supprime une séance

### Élèves
- `GET /api/eleves` - Liste tous les élèves
- `GET /api/eleves/:id` - Récupère un élève
- `GET /api/eleves/parent/:parentId` - Élèves d'un parent
- `POST /api/eleves` - Crée un élève
- `PUT /api/eleves/:id` - Met à jour un élève
- `DELETE /api/eleves/:id` - Supprime un élève

### Annonces
- `GET /api/annonces` - Liste toutes les annonces
- `GET /api/annonces/:id` - Récupère une annonce
- `GET /api/annonces/professeur/:profId` - Annonces d'un professeur
- `POST /api/annonces` - Crée une annonce
- `PUT /api/annonces/:id` - Met à jour une annonce
- `PATCH /api/annonces/:id/statut` - Met à jour le statut
- `DELETE /api/annonces/:id` - Supprime une annonce

## 🛠️ Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de données**: MySQL 8
- **ORM**: mysql2 (promises)
