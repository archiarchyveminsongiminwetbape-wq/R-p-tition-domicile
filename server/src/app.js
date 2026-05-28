const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./config/database');

const professeurRoutes = require('./routes/professeurRoutes');
const seanceRoutes = require('./routes/seanceRoutes');
const eleveRoutes = require('./routes/eleveRoutes');
const annonceRoutes = require('./routes/annonceRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://r-p-tition-domicile.vercel.app', 'https://r-p-tition-domicile.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/professeurs', professeurRoutes);
app.use('/api/seances', seanceRoutes);
app.use('/api/eleves', eleveRoutes);
app.use('/api/annonces', annonceRoutes);

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const frontendPath = path.join(__dirname, '../../frontend-dist');
  app.use(express.static(frontendPath));

  // Route fallback pour le SPA (Single Page Application)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'API Répétitions à Domicile',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    vercel: !!process.env.VERCEL,
    endpoints: {
      auth: '/api/auth',
      professeurs: '/api/professeurs',
      seances: '/api/seances',
      eleves: '/api/eleves',
      annonces: '/api/annonces'
    }
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

module.exports = app;