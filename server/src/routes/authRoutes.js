const express = require('express');
const router = express.Router();
const {
  registerSimple,
  loginSimple,
  updateUserRole,
  getUserProfile
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Inscription avec JWT
router.post('/register', registerSimple);

// Connexion avec JWT
router.post('/login', loginSimple);

// Mettre à jour le rôle
router.put('/role', updateUserRole);

// Obtenir le profil utilisateur (protégé par JWT)
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;