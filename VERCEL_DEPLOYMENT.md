# Guide de déploiement Vercel - Répétitions à Domicile

## 🚀 Déploiement sur Vercel

Ce guide vous explique comment déployer votre application complète (frontend + backend) sur Vercel.

## 📋 Architecture

- **Frontend** : Application React/Vite
- **Backend** : API Express via Vercel Functions
- **Base de données** : PostgreSQL via Prisma Cloud
- **Authentification** : JWT + Prisma

## 🔧 Configuration requise

### 1. Variables d'environnement dans Vercel

Rendez-vous dans votre dashboard Vercel : `Settings > Environment Variables`

Ajoutez les variables suivantes :

```
NODE_ENV=production
VERCEL=true
DATABASE_URL=postgresql://5aaeaff177d8ff0461e3a6f28e2dac3ee742099620f8faaf60b4e76df1d1f8c8:sk_c9Sxq8RLITGOLL6oCrv8B@pooled.db.prisma.io:5432/postgres?sslmode=require
JWT_SECRET=repetitions-domicile-secret-key-2024-very-secure-production
PRISMA_API_KEY=votre-clé-api-prisma-cloud
```

**⚠️ IMPORTANT** : Changez le `JWT_SECRET` avec une valeur sécurisée unique !

### 2. Configuration du projet

Le fichier `vercel.json` est déjà configuré pour :
- Builder le frontend avec Vite
- Exposer les API Functions via `/api/*`
- Servir les fichiers statiques du frontend

## 📦 Méthodes de déploiement

### Méthode 1 : Via Git (recommandée)

1. **Pousser votre code sur GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Configuration Vercel"
   git push origin main
   ```

2. **Importer le projet dans Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez "Add New Project"
   - Importez votre repository
   - Vercel détectera automatiquement la configuration

3. **Configurer les variables d'environnement**
   - Dans les settings du projet Vercel
   - Ajoutez les variables listées ci-dessus

4. **Deployer**
   - Cliquez sur "Deploy"
   - Vercel va builder et déployer automatiquement

### Méthode 2 : Via Vercel CLI

1. **Installer Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   vercel
   ```

4. **Déployer en production**
   ```bash
   vercel --prod
   ```

## 🔧 Dépendances

Vercel installera automatiquement les dépendances, mais assurez-vous que vos `package.json` sont corrects :

### Frontend (package.json racine)
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
    "vite": "^5.2.11",
    "@vitejs/plugin-react": "^4.3.0"
  }
}
```

### Backend (server/package.json)
```json
{
  "dependencies": {
    "@prisma/client": "^5.20.0",
    "express": "^4.22.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.3",
    "cors": "^2.8.6",
    "dotenv": "^16.6.1"
  },
  "devDependencies": {
    "prisma": "^5.20.0"
  }
}
```

## 🗄️ Base de données Prisma

La base de données est déjà configurée avec Prisma Cloud. Les migrations sont appliquées automatiquement via `prisma db push`.

Si vous avez besoin d'appliquer des migrations manuelles :

```bash
cd server
npx prisma db push
```

## 🧪 Test local avant déploiement

1. **Démarrer le frontend**
   ```bash
   npm run dev
   ```

2. **Démarrer le backend**
   ```bash
   cd server
   npm start
   ```

3. **Tester l'inscription**
   - Allez sur http://localhost:5173/inscription
   - Testez la création de compte

## 🌐 URL après déploiement

Une fois déployé sur Vercel :
- **Frontend** : `https://votre-projet.vercel.app`
- **API Backend** : `https://votre-projet.vercel.app/api/*`
- **Database** : Prisma Cloud PostgreSQL

## 🔄 Déploiements automatiques

Avec Vercel, chaque push sur votre branche principale déclenche automatiquement :
- Build du frontend
- Build des API Functions
- Tests de base
- Déploiement sur preview (si branches)
- Déploiement en production (si main)

## 📊 Monitoring

Vercel fournit automatiquement :
- **Analytics** : Visites, performance
- **Logs** : Logs des API Functions
- **Error tracking** : Erreurs en temps réel
- **Speed insights** : Performance du frontend

## 🔐 Sécurité

1. **Variables d'environnement** : Jamais commitées en clair
2. **HTTPS** : Automatique sur Vercel
3. **JWT Secret** : Changez-le en production
4. **CORS** : Configuré pour autoriser votre domaine

## 🐛 Résolution de problèmes

### Build échoue
```bash
# Test local du build
npm run build
```

### API Functions ne répondent pas
- Vérifiez les logs dans le dashboard Vercel
- Vérifiez les variables d'environnement
- Testez l'API directement : `curl https://votre-projet.vercel.app/api`

### Erreur de connexion base de données
- Vérifiez `DATABASE_URL` dans les variables Vercel
- Testez la connexion avec Prisma Studio localement

### Frontend blanc
- Vérifiez que le build a réussi
- Regardez les logs du navigateur (F12)
- Vérifiez que `VITE_API_URL` est correct

## 📝 Checklist avant déploiement

- [ ] Code pushé sur Git
- [ ] Variables d'environnement configurées dans Vercel
- [ ] JWT_SECRET changé pour une valeur sécurisée
- [ ] DATABASE_URL correct (Prisma Cloud)
- [ ] Tests locaux passés
- [ ] Build local réussi (`npm run build`)
- [ ] API testée localement

## 🎉 Après déploiement

1. **Testez l'application** sur l'URL Vercel
2. **Vérifiez les logs** dans le dashboard Vercel
3. **Configurez votre domaine personnalisé** (optionnel)
4. **Met en place les alertes** pour les erreurs

## 📚 Ressources utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Vercel Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Prisma Cloud](https://www.prisma.io/cloud)
- [Vite + Vercel](https://vitejs.dev/guide/deployment.html#vercel)

## 🆘 Support

En cas de problème :
1. Vérifiez les logs Vercel
2. Testez localement
3. Consultez la documentation Vercel
4. Vérifiez les variables d'environnement