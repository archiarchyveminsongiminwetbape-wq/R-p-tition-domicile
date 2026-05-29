const prisma = require('../config/database');

class Parent {
  // Récupérer un parent par ID
  static async getById(id) {
    try {
      const parent = await prisma.parent.findUnique({
        where: { id },
        include: {
          utilisateur: true,
          eleves: {
            include: {
              niveau: true
            }
          },
          reservations: {
            include: {
              professeur: true,
              eleve: true
            }
          }
        }
      });
      return parent;
    } catch (error) {
      throw new Error('Erreur lors de la récupération du parent: ' + error.message);
    }
  }

  // Mettre à jour un parent
  static async update(id, parentData) {
    try {
      const { nom, prenom, email, telephone, adresse } = parentData;
      const parent = await prisma.parent.update({
        where: { id },
        data: {
          nom,
          prenom,
          email,
          telephone,
          adresse
        },
        include: {
          utilisateur: true
        }
      });
      return parent;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du parent: ' + error.message);
    }
  }
}

module.exports = Parent;