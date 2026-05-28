const prisma = require('../config/database');

class User {
  // Récupérer un utilisateur par email
  static async getByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          eleves: true
        }
      });
      return user;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'utilisateur: ' + error.message);
    }
  }

  // Récupérer un utilisateur par ID
  static async getById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          eleves: true
        }
      });
      return user;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'utilisateur: ' + error.message);
    }
  }

  // Créer un utilisateur directement dans PostgreSQL
  static async createLocalUser(userData) {
    try {
      const { email, nom, prenom, password, role } = userData;
      
      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Hasher le mot de passe (utiliser bcryptjs)
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          nom,
          prenom,
          password: hashedPassword,
          role: role || 'parent'
        },
        include: {
          eleves: true
        }
      });
      return user;
    } catch (error) {
      throw new Error('Erreur lors de la création de l\'utilisateur: ' + error.message);
    }
  }

  // Vérifier les identifiants de connexion
  static async verifyCredentials(email, password) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user || !user.password) {
        throw new Error('Identifiants incorrects');
      }

      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Identifiants incorrects');
      }

      return user;
    } catch (error) {
      throw new Error('Erreur lors de la vérification des identifiants: ' + error.message);
    }
  }

  // Mettre à jour le rôle d'un utilisateur
  static async updateRole(userId, role) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
        include: {
          eleves: true
        }
      });
      return user;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du rôle: ' + error.message);
    }
  }
}

module.exports = User;