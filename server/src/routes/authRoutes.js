const express = require('express');
const router = express.Router();
const {
  syncAuth0User,
  registerLocal,
  loginLocal,
  updateUserRole,
  getUserProfile,
  authenticateToken
} = require('../controllers/authController');

// Route pour synchroniser un utilisateur Auth0
router.post('/sync', syncAuth0User);

// Inscription locale (sans Auth0)
router.post('/register', registerLocal);

// Connexion locale (sans Auth0)
router.post('/login', loginLocal);

// Mettre à jour le rôle (nécessite authentification)
router.put('/role', authenticateToken, updateUserRole);

// Obtenir le profil utilisateur (nécessite authentification)
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;