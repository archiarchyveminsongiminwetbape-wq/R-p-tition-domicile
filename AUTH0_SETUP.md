# Configuration Auth0 — Répétitions à Domicile

## 1. Paramètres de l'application Auth0

Dans le dashboard Auth0 → **Applications** → votre app → **Settings** :

| Champ | Valeur |
|---|---|
| Allowed Callback URLs | `http://localhost:5173/callback, https://votre-domaine.com/callback` |
| Allowed Logout URLs | `http://localhost:5173, https://votre-domaine.com` |
| Allowed Web Origins | `http://localhost:5173, https://votre-domaine.com` |
| Token Endpoint Auth Method | `None` (SPA) |

Enregistrez les changements.

---

## 2. Action Post-Login (OBLIGATOIRE)

Cette Action ajoute le rôle de l'utilisateur dans le token JWT.

Dans Auth0 → **Actions** → **Flows** → **Login** → **+** → **Build Custom** :

```javascript
// Nom : Add Role To Token
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://repetitions-domicile';

  // Lire le rôle depuis user_metadata (défini à l'inscription)
  const role = event.user.user_metadata?.role
            ?? event.user.app_metadata?.role;

  if (role) {
    // Ajouter dans l'ID token (lu par le frontend)
    api.idToken.setCustomClaim(`${namespace}/role`, role);
    // Ajouter dans l'Access token (pour les appels API)
    api.accessToken.setCustomClaim(`${namespace}/role`, role);
  }
};
```

Déployez l'Action et ajoutez-la au flow **Login**.

---

## 3. Permissions Management API

Dans Auth0 → **APIs** → **Auth0 Management API** → **Machine to Machine Applications** :

Autorisez votre application avec les scopes :
- `read:users`
- `update:users`
- `update:current_user_metadata`

---

## 4. Connexion Google (déjà configurée)

- Connection ID : `con_cG3eHMZqt8YmFjbo`
- Assurez-vous que la connexion Google est activée pour votre application.

---

## 5. Variables d'environnement (.env)

```env
VITE_AUTH0_DOMAIN=dev-438y6jyr2dtvpplm.us.auth0.com
VITE_AUTH0_CLIENT_ID=FEJNP2uqDqGGlwDxwbGyGcTiD3NtowA6
VITE_AUTH0_AUDIENCE=https://dev-438y6jyr2dtvpplm.us.auth0.com/api/v2/
VITE_AUTH0_CALLBACK_URL=http://localhost:5173/callback
VITE_ROLE_NAMESPACE=https://repetitions-domicile
```

> ⚠️ Ne commitez jamais le fichier `.env` dans Git.

---

## 6. Flux d'authentification

```
Utilisateur → Landing page
    │
    ├─ Inscription email/mot de passe
    │    └─ POST /dbconnections/signup (avec role en user_metadata)
    │         └─ Redirect Auth0 Login → /callback → /app
    │
    ├─ Inscription Google OAuth
    │    └─ loginWithRedirect (connection: google-oauth2)
    │         └─ /callback → pas de rôle → /choisir-role → /app
    │
    └─ Connexion existante
         └─ loginWithRedirect → /callback → /app
```

---

## 7. Lancer le projet

```bash
npm install
npm run dev
# → http://localhost:5173
```
