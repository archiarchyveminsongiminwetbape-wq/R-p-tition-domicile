const app = require('./app');
const PORT = process.env.PORT || 3000;

// Démarrage du serveur (seulement si pas sur Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}/api`);
  });
}

module.exports = app;
