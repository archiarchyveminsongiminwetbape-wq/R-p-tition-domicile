const User = require('../models/User');

// Inscription simple - enregistrement direct dans PostgreSQL
const registerSimple = async (req, res) => {
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

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({ error: error.message });
  }
};

// Connexion simple - vérification directe dans PostgreSQL
const loginSimple = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await User.verifyCredentials(email, password);

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
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

    if (!userId || !role || !['parent', 'professeur'].includes(role)) {
      return res.status(400).json({ error: 'Données invalides' });
    }

    const user = await User.updateRole(userId, role);

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur de mise à jour du rôle:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir le profil utilisateur
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.getByEmail(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erreur de récupération du profil:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerSimple,
  loginSimple,
  updateUserRole,
  getUserProfile
};