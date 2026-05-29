const prisma = require('../config/database');

class Matiere {
  // Récupérer toutes les matières
  static async getAll() {
    try {
      const matieres = await prisma.matiere.findMany({
        orderBy: { nom: 'asc' }
      });
      return matieres;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des matières: ' + error.message);
    }
  }

  // Récupérer une matière par ID
  static async getById(id) {
    try {
      const matiere = await prisma.matiere.findUnique({
        where: { id },
        include: {
          professeurs: {
            include: {
              professeur: true
            }
          },
          annonces: true
        }
      });
      return matiere;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de la matière: ' + error.message);
    }
  }

  // Créer une nouvelle matière
  static async create(matiereData) {
    try {
      const { nom, description } = matiereData;
      const matiere = await prisma.matiere.create({
        data: {
          nom,
          description
        }
      });
      return matiere;
    } catch (error) {
      throw new Error('Erreur lors de la création de la matière: ' + error.message);
    }
  }
}

module.exports = Matiere;