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

  // Récupérer un utilisateur par Auth0 ID
  static async getByAuth0Id(auth0Id) {
    try {
      const user = await prisma.user.findUnique({
        where: { auth0Id },
        include: {
          eleves: true
        }
      });
      return user;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'utilisateur: ' + error.message);
    }
  }

  // Créer ou mettre à jour un utilisateur (synchronisation Auth0)
  static async syncUser(userData) {
    try {
      const { auth0Id, email, nom, prenom, role, picture } = userData;
      
      // Chercher si l'utilisateur existe déjà par email ou auth0Id
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { auth0Id }
          ]
        }
      });

      if (user) {
        // Mettre à jour l'utilisateur existant
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            auth0Id: auth0Id || user.auth0Id,
            nom: nom || user.nom,
            prenom: prenom || user.prenom,
            role: role || user.role
          },
          include: {
            eleves: true
          }
        });
      } else {
        // Créer un nouvel utilisateur
        user = await prisma.user.create({
          data: {
            auth0Id,
            email,
            nom,
            prenom,
            role: role || 'parent'
          },
          include: {
            eleves: true
          }
        });
      }

      return user;
    } catch (error) {
      throw new Error('Erreur lors de la synchronisation de l\'utilisateur: ' + error.message);
    }
  }

  // Créer un utilisateur local (inscription sans Auth0)
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

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Erreur lors de la création de l\'utilisateur: ' + error.message);
    }
  }

  // Vérifier les identifiants de connexion locale
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

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
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