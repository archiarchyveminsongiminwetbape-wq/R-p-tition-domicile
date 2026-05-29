const prisma = require('../config/database');

class Utilisateur {
  // Récupérer un utilisateur par email
  static async getByEmail(email) {
    try {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { email },
        include: {
          professeur: true,
          parent: {
            include: {
              eleves: {
                include: {
                  niveau: true
                }
              }
            }
          }
        }
      });
      return utilisateur;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'utilisateur: ' + error.message);
    }
  }

  // Récupérer un utilisateur par ID
  static async getById(id) {
    try {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id },
        include: {
          professeur: true,
          parent: {
            include: {
              eleves: {
                include: {
                  niveau: true
                }
              }
            }
          }
        }
      });
      return utilisateur;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'utilisateur: ' + error.message);
    }
  }

  // Créer un utilisateur directement dans PostgreSQL
  static async createLocalUser(userData) {
    try {
      const { email, nom, prenom, password, role, telephone, adresse } = userData;
      
      // Vérifier si l'email existe déjà
      const existingUser = await prisma.utilisateur.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
      }

      // Hasher le mot de passe (utiliser bcryptjs)
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      const utilisateur = await prisma.utilisateur.create({
        data: {
          email,
          password: hashedPassword,
          role: role || 'parent'
        }
      });

      // Créer le profil spécifique selon le rôle
      if (role === 'professeur') {
        await prisma.professeur.create({
          data: {
            utilisateurId: utilisateur.id,
            nom,
            prenom,
            email,
            telephone,
            tarif_horaire: 0
          }
        });
      } else if (role === 'parent') {
        await prisma.parent.create({
          data: {
            utilisateurId: utilisateur.id,
            nom,
            prenom,
            email,
            telephone,
            adresse
          }
        });
      }

      return await this.getById(utilisateur.id);
    } catch (error) {
      throw new Error('Erreur lors de la création de l\'utilisateur: ' + error.message);
    }
  }

  // Vérifier les identifiants de connexion
  static async verifyCredentials(email, password) {
    try {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { email },
        include: {
          professeur: true,
          parent: {
            include: {
              eleves: {
                include: {
                  niveau: true
                }
              }
            }
          }
        }
      });

      if (!utilisateur || !utilisateur.password) {
        throw new Error('Identifiants incorrects');
      }

      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(password, utilisateur.password);

      if (!isValidPassword) {
        throw new Error('Identifiants incorrects');
      }

      return utilisateur;
    } catch (error) {
      throw new Error('Erreur lors de la vérification des identifiants: ' + error.message);
    }
  }

  // Mettre à jour le rôle d'un utilisateur
  static async updateRole(userId, role) {
    try {
      const utilisateur = await prisma.utilisateur.update({
        where: { id: userId },
        data: { role },
        include: {
          professeur: true,
          parent: {
            include: {
              eleves: {
                include: {
                  niveau: true
                }
              }
            }
          }
        }
      });
      return utilisateur;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du rôle: ' + error.message);
    }
  }
}

module.exports = Utilisateur;