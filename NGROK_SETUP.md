# Instructions pour ngrok - Backend Local

## Installation de ngrok

1. Téléchargez ngrok depuis https://ngrok.com/download
2. Installez ngrok sur votre machine
3. Créez un compte gratuit sur https://ngrok.com

## Démarrer le Backend Local

1. Assurez-vous que le serveur backend est démarré :
```bash
cd server
npm start
```

## Exposer le Backend avec ngrok

1. Exposez le port 3008 (backend local) :
```bash
ngrok http 3008
```

2. ngrok vous donnera une URL publique comme :
   ```
   https://random-id.ngrok.io
   ```

## Configurer le Frontend Vercel

Mette à jour l'URL API dans les variables d'environnement Vercel :

1. Allez sur votre projet Vercel : https://vercel.com/archiarchyveminsongiminwetbape-wq/R-pition-domicile/settings/environment-variables
2. Ajoutez une variable d'environnement :
   - **Nom** : `VITE_API_URL`
   - **Valeur** : `https://votre-url-ngrok.io/api` (remplacez par votre URL ngrok)
3. Redéployez le projet Vercel

## Alternative : Mode Développement

Pour tester rapidement sans ngrok, vous pouvez utiliser le mode développement local :

1. Clonez le repository sur votre machine locale
2. Installez les dépendances :
   ```bash
   npm install
   cd server
   npm install
   ```
3. Démarrz le serveur backend :
   ```bash
   npm start
   ```
4. Dans un autre terminal, démarrez le frontend :
   ```bash
   npm run dev
   ```

L'application sera accessible sur http://localhost:5173 avec le backend local fonctionnel.

## Notes

- Le backend doit rester en cours d'exécution tant que ngrok est actif
- ngrok change l'URL publique à chaque redémarrage
- Pour la production, envisagez de déployer le backend sur Render ou Railway