# Guide de déploiement en production - Répétitions à Domicile

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Base de données PostgreSQL (Prisma Cloud déjà configurée)
- Variables d'environnement configurées

## 🔧 Configuration des variables d'environnement

### Backend (server/.env)

```env
# Serveur
PORT=3000
NODE_ENV=production

# Base de données Prisma PostgreSQL
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# JWT Secret (important: changez ceci en production!)
JWT_SECRET=votre-secret-jet-secret-very-long-and-secure
```

### Frontend (.env.production)

```env
VITE_API_URL=https://votre-domaine.com/api
```

## 🚀 Déploiement complet

### Étape 1: Installer les dépendances

```bash
# Installer les dépendances du frontend
npm install

# Installer les dépendances du backend
cd server
npm install
cd ..
```

### Étape 2: Configurer la base de données

```bash
cd server

# Générer le client Prisma
npm run prisma:generate

# Appliquer les migrations en production
npm run prisma:deploy
```

### Étape 3: Builder le frontend

```bash
# Depuis le répertoire racine
npm run build:prod
```

Cela va:
- Compiler l'application React avec Vite
- Déplacer le dossier `dist` vers `frontend-dist` (accessible par le serveur)

### Étape 4: Démarrer le serveur en production

```bash
cd server
npm start
```

Le serveur va:
- Démarrer l'API backend sur le port configuré
- Servir les fichiers statiques du frontend
- Gérer le routing SPA (Single Page Application)

## 🌐 Options de déploiement

### Option 1: Serveur VPS traditionnel

```bash
# Sur votre serveur (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm

# Cloner votre repository
git clone votre-repo-url
cd repetitions-domicile

# Suivre les étapes de déploiement ci-dessus

# Utiliser PM2 pour la gestion de processus
npm install -g pm2
pm2 start server/src/server.js --name repetitions-domicile
pm2 startup
pm2 save
```

### Option 2: Docker

Créer un `Dockerfile` dans le répertoire racine:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package.json
COPY package*.json ./
COPY server/package*.json ./server/

# Installer les dépendances
RUN npm install
RUN cd server && npm install

# Copier le code source
COPY . .

# Builder le frontend
RUN npm run build:prod

# Générer Prisma Client
RUN cd server && npx prisma generate

# Exposer le port
EXPOSE 3000

# Démarrer le serveur
CMD ["node", "server/src/server.js"]
```

Construire et lancer:

```bash
docker build -t repetitions-domicile .
docker run -p 3000:3000 --env-file .env repetitions-domicile
```

### Option 3: Services Cloud

#### Vercel (Frontend only)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

#### Railway/Render/Heroku (Full-stack)
Le fichier `server/package.json` est déjà configuré avec les scripts nécessaires.

## 🔐 Sécurité en production

1. **Changez le JWT_SECRET** dans `server/.env`
2. **Utilisez HTTPS** avec un certificat SSL (Let's Encrypt gratuit)
3. **Configurez le CORS** pour autoriser uniquement votre domaine
4. **Limitez les taux** avec un middleware de rate limiting
5. **Activez les logs** pour surveiller les activités suspectes

## 📊 Surveillance et maintenance

```bash
# Voir les logs avec PM2
pm2 logs repetitions-domicile

# Redémarrer le service
pm2 restart repetitions-domicile

# Mettre à jour l'application
git pull
npm install
cd server && npm install
cd ..
npm run build:prod
pm2 restart repetitions-domicile
```

## 🐛 Dépannage

### Problème: "EADDRINUSE" (port déjà utilisé)
```bash
# Trouver le processus utilisant le port
netstat -tulpn | grep :3000
# Tuer le processus ou changer le PORT dans .env
```

### Problème: Database connection failed
```bash
# Vérifier la connexion à la base de données
cd server
npx prisma studio
```

### Problème: Frontend non servi
```bash
# Vérifier que le dossier frontend-dist existe
ls -la ../frontend-dist

# Rebuild le frontend si nécessaire
npm run build:prod
```

## 📝 Notes importantes

- Le frontend et le backend sont servis par le même serveur Express en production
- Les variables d'environnement doivent être configurées avant le déploiement
- Assurez-vous que votre base de données PostgreSQL est accessible
- Sauvegardez régulièrement votre base de données