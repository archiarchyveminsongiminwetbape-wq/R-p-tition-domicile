const prisma = require('../config/database');

class Niveau {
  // Récupérer tous les niveaux
  static async getAll() {
    try {
      const niveaux = await prisma.niveau.findMany({
        orderBy: { nom: 'asc' }
      });
      return niveaux;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des niveaux: ' + error.message);
    }
  }

  // Récupérer un niveau par ID
  static async getById(id) {
    try {
      const niveau = await prisma.niveau.findUnique({
        where: { id },
        include: {
          eleves: true,
          annonces: {
            include: {
              annonce: true
            }
          }
        }
      });
      return niveau;
    } catch (error) {
      throw new Error('Erreur lors de la récupération du niveau: ' + error.message);
    }
  }

  // Créer un nouveau niveau
  static async create(niveauData) {
    try {
      const { nom, description } = niveauData;
      const niveau = await prisma.niveau.create({
        data: {
          nom,
          description
        }
      });
      return niveau;
    } catch (error) {
      throw new Error('Erreur lors de la création du niveau: ' + error.message);
    }
  }
}

module.exports = Niveau;