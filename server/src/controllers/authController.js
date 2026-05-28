const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jet-secret';

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Synchronisation avec Auth0 (après connexion/inscription Auth0)
const syncAuth0User = async (req, res) => {
  try {
    const { auth0Id, email, nom, prenom, role, picture } = req.body;

    if (!email || !nom || !prenom) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }

    const user = await User.syncUser({
      auth0Id,
      email,
      nom,
      prenom,
      role,
      picture
    });

    // Générer un token JWT pour l'application
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        eleves: user.eleves
      },
      token
    });
  } catch (error) {
    console.error('Erreur de synchronisation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Inscription locale (sans Auth0)
const registerLocal = async (req, res) => {
  try {
    const { email, nom, prenom, password, role } = req.body;

    if (!email || !nom || !prenom || !password) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }

    const user = await User.createLocalUser({
      email,
      nom,
      prenom,
      password,
      role: role || 'parent'
    });

    // Générer un token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      user,
      token
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ error: error.message });
  }
};

// Connexion locale (sans Auth0)
const loginLocal = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await User.verifyCredentials(email, password);

    // Générer un token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user,
      token
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(401).json({ error: error.message });
  }
};

// Mettre à jour le rôle de l'utilisateur
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.userId;

    if (!role || !['parent', 'professeur'].includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    const user = await User.updateRole(userId, role);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erreur de mise à jour du rôle:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir le profil utilisateur
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.getByAuth0Id(userId) || await User.getByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        eleves: user.eleves
      }
    });
  } catch (error) {
    console.error('Erreur de récupération du profil:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  authenticateToken,
  syncAuth0User,
  registerLocal,
  loginLocal,
  updateUserRole,
  getUserProfile
};