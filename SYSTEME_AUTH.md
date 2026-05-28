# Système d'Authentification Simplifié

## 🔐 Architecture Simple

Le système d'authentification a été simplifié au maximum :

### Flux d'inscription
1. Utilisateur remplit le formulaire d'inscription
2. Données envoyées à `/api/auth/register`
3. Enregistrement DIRECT dans PostgreSQL via Prisma
4. Mot de passe hashé avec bcryptjs
5. Données utilisateur stockées dans localStorage
6. Redirection vers sélection du rôle

### Flux de connexion
1. Utilisateur entre email et mot de passe
2. Données envoyées à `/api/auth/login`
3. Vérification DIRECTE dans PostgreSQL
4. Si correct → données utilisateur stockées dans localStorage
5. Accès à l'application

### Session
- Pas de tokens JWT complexes
- Données utilisateur dans localStorage
- Vérification simple de présence d'utilisateur dans localStorage
- Logout = suppression des données localStorage

## 📊 Structure des données

### Table User (PostgreSQL)
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  nom       String
  prenom    String
  password  String   // hashé avec bcryptjs
  role      String   @default("parent")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  eleves    Eleve[]
}
```

## ⚙️ Configuration Vercel

Variables d'environnement à configurer dans Vercel Dashboard :

```
NODE_ENV=production
DATABASE_URL=postgresql://5aaeaff177d8ff0461e3a6f28e2dac3ee742099620f8faaf60b4e76df1d1f8c8:sk_c9Sxq8RLITGOLL6oCrv8B@pooled.db.prisma.io:5432/postgres?sslmode=require
```

## 🚀 Avantages

✅ **Simplicité** : Pas de tokens, pas de JWT complexe
✅ **Performance** : Vérification directe dans PostgreSQL
✅ **Sécurité** : Mots de passe hashés avec bcryptjs
✅ **Maintenance** : Moins de code complexe à maintenir
✅ **Fiabilité** : Moins de points de défaillance

## 🔧 API Endpoints

### POST /api/auth/register
Inscription d'un nouvel utilisateur
```json
{
  "email": "email@example.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "password": "motdepasse123",
  "role": "parent"
}
```

### POST /api/auth/login
Connexion d'un utilisateur existant
```json
{
  "email": "email@example.com",
  "password": "motdepasse123"
}
```

### PUT /api/auth/role
Mise à jour du rôle d'un utilisateur
```json
{
  "userId": "uuid-de-l-utilisateur",
  "role": "parent" ou "professeur"
}
```

### GET /api/auth/profile?userId=uuid
Récupération du profil utilisateur

## 🎯 Workflow Complet

1. **Inscription** → PostgreSQL → localStorage → sélection rôle
2. **Sélection rôle** → Update PostgreSQL → localStorage → Dashboard
3. **Utilisation** → Données dans localStorage → Application
4. **Logout** → Suppression localStorage → Page connexion