const express = require('express');
const router = express.Router();
const {
  registerSimple,
  loginSimple,
  updateUserRole,
  getUserProfile
} = require('../controllers/authController');

// Inscription simple - enregistrement direct dans PostgreSQL
router.post('/register', registerSimple);

// Connexion simple - vérification directe dans PostgreSQL
router.post('/login', loginSimple);

// Mettre à jour le rôle
router.put('/role', updateUserRole);

// Obtenir le profil utilisateur
router.get('/profile', getUserProfile);

module.exports = router;