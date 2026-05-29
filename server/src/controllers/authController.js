const Utilisateur = require('../models/User');
const { generateToken, generateRefreshToken } = require('../middleware/auth');

// Inscription avec JWT
const registerSimple = async (req, res) => {
  try {
    const { email, nom, prenom, password, role, telephone, adresse } = req.body;

    if (!email || !nom || !prenom || !password) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }

    const utilisateur = await Utilisateur.createLocalUser({
      email,
      nom,
      prenom,
      password,
      role: role || 'parent',
      telephone,
      adresse
    });

    // Générer les tokens JWT
    const token = generateToken(utilisateur);
    const refreshToken = generateRefreshToken(utilisateur);

    // Retourner l'utilisateur sans le mot de passe avec les tokens
    const { password: _, ...utilisateurWithoutPassword } = utilisateur;

    res.status(201).json({
      success: true,
      user: utilisateurWithoutPassword,
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ error: error.message });
  }
};

// Connexion avec JWT
const loginSimple = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const utilisateur = await Utilisateur.verifyCredentials(email, password);

    // Générer les tokens JWT
    const token = generateToken(utilisateur);
    const refreshToken = generateRefreshToken(utilisateur);

    // Retourner l'utilisateur sans le mot de passe avec les tokens
    const { password: _, ...utilisateurWithoutPassword } = utilisateur;

    res.json({
      success: true,
      user: utilisateurWithoutPassword,
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(401).json({ error: error.message });
  }
};

// Mettre à jour le rôle de l'utilisateur
const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role || !['parent', 'professeur', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Données invalides' });
    }

    const utilisateur = await Utilisateur.updateRole(parseInt(userId), role);

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...utilisateurWithoutPassword } = utilisateur;

    res.json({
      success: true,
      user: utilisateurWithoutPassword
    });
  } catch (error) {
    console.error('Erreur de mise à jour du rôle:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir le profil utilisateur (avec authentification JWT)
const getUserProfile = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.getById(req.user.id);

    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...utilisateurWithoutPassword } = utilisateur;

    res.json({
      success: true,
      user: utilisateurWithoutPassword
    });
  } catch (error) {
    console.error('Erreur de récupération du profil:', error);
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour le profil utilisateur (avec authentification JWT)
const updateUserProfile = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.updateProfile(req.user.id, req.body);

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...utilisateurWithoutPassword } = utilisateur;

    res.json({
      success: true,
      user: utilisateurWithoutPassword
    });
  } catch (error) {
    console.error('Erreur de mise à jour du profil:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerSimple,
  loginSimple,
  updateUserRole,
  getUserProfile,
  updateUserProfile
};