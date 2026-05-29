const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware de vérification du token JWT
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// Middleware de vérification du rôle
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    next();
  };
};

// Génération de token JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Génération de refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = {
  authMiddleware,
  roleMiddleware,
  generateToken,
  generateRefreshToken
};