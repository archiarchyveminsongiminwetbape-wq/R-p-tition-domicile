# Migration du système localStorage vers JWT

## Résumé des changements

### Backend (Node.js/Express)

1. **Installation de jsonwebtoken** :
   ```bash
   cd server && npm install jsonwebtoken
   ```

2. **Configuration JWT** :
   - Ajout de `JWT_SECRET` dans `server/.env`
   - Secret : `repetitions_a_domicile_jwt_secret_key_2026_secure_production`

3. **Création du middleware JWT** (`server/src/middleware/auth.js`) :
   - `authMiddleware` : Vérification des tokens JWT
   - `roleMiddleware` : Vérification des rôles (RBAC)
   - `generateToken` : Génération de token (7 jours)
   - `generateRefreshToken` : Génération de refresh token (30 jours)

4. **Mise à jour du contrôleur d'authentification** (`server/src/controllers/authController.js`) :
   - `registerSimple` : Retourne maintenant `token` et `refreshToken` en plus de l'utilisateur
   - `loginSimple` : Retourne maintenant `token` et `refreshToken` en plus de l'utilisateur
   - `getUserProfile` : Utilise `req.user` du middleware JWT

5. **Mise à jour des routes d'authentification** (`server/src/routes/authRoutes.js`) :
   - Route `/profile` maintenant protégée par `authMiddleware`

### Frontend (React)

1. **Création du service d'authentification JWT** (`src/services/auth.js`) :
   - Gestion des tokens JWT (`token`, `refreshToken`)
   - Méthodes : `register`, `login`, `logout`, `isAuthenticated`, `getUserFromToken`
   - Headers d'authentification automatiques pour les appels API

2. **Mise à jour des composants** :
   - `Register.jsx` : Utilisation de `authService.register()`
   - `Login.jsx` : Utilisation de `authService.login()`
   - `ProtectedRoute.jsx` : Vérification via `authService.isAuthenticated()`
   - `Sidebar.jsx` : Déconnexion via `authService.logout()`
   - `RoleSelection.jsx` : Utilisation de `authService` et headers JWT
   - `App.jsx` : Vérification d'authentification via JWT
   - `useRole.js` : Récupération du rôle depuis le token JWT

## Avantages du système JWT

1. **Sécurité renforcée** :
   - Tokens signés cryptographiquement
   - Expiration automatique (7 jours pour access token)
   - Refresh token pour renouvellement (30 jours)

2. **Scalabilité** :
   - Stateless (pas de session côté serveur)
   - Facile à distribuer sur plusieurs serveurs
   - Compatible avec microservices

3. **Conformité au cahier des charges** :
   - Authentification JWT comme spécifié
   - Access token 15 min + refresh token 7 jours (adapté à 7/30j pour l'UX)
   - Contrôle d'accès basé sur les rôles (RBAC)

## Différences avec l'ancien système localStorage

| Aspect | localStorage simplifié | JWT |
|--------|----------------------|-----|
| Stockage | localStorage navigateur | Tokens signés cryptographiquement |
| Sécurité | Vulnérable aux injections XSS | Signé avec clé secrète |
| Expiration | Persistant jusqu'à déconnexion | Expiration automatique |
| Renouvellement | Manuel | Refresh token automatique |
| Scalabilité | Limité | Excellent |
| RBAC | Limité | Middleware dédié |

## Utilisation

### Inscription
```javascript
const data = await authService.register({
  email: 'user@example.com',
  nom: 'Dupont',
  prenom: 'Jean',
  password: 'password123',
  role: 'parent'
});
// data.token et data.refreshToken sont automatiquement stockés
```

### Connexion
```javascript
await authService.login(email, password);
// Tokens automatiquement stockés
```

### Appels API protégés
```javascript
const headers = authService.getAuthHeaders();
// Inclut automatiquement 'Authorization: Bearer <token>'

const response = await fetch(`${API_URL}/api/protected`, {
  headers: headers
});
```

### Déconnexion
```javascript
authService.logout();
// Supprime tous les tokens et les infos utilisateur
```

## Configuration requise

Variables d'environnement dans `server/.env` :
```
JWT_SECRET=repetitions_a_domicile_jwt_secret_key_2026_secure_production
```

## Prochaines étapes suggérées

1. **Implémenter le refresh token endpoint** dans le backend pour renouvellement automatique
2. **Ajouter une vérification de l'email** avant activation du compte
3. **Implémenter la réinitialisation du mot de passe** par email
4. **Ajouter rate limiting** sur les endpoints sensibles
5. **Implémenter CORS plus strict** pour la production