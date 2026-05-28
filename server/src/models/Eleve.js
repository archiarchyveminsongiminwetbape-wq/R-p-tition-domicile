const prisma = require('../config/database');

class Eleve {
  // Récupérer tous les élèves
  static async getAll() {
    try {
      const eleves = await prisma.eleve.findMany({
        include: {
          parent: {
            select: {
              nom: true,
              prenom: true
            }
          }
        },
        orderBy: { nom: 'asc' }
      });
      
      return eleves.map(eleve => ({
        ...eleve,
        parent_nom: `${eleve.parent.prenom} ${eleve.parent.nom}`
      }));
    } catch (error) {
      throw new Error('Erreur lors de la récupération des élèves: ' + error.message);
    }
  }

  // Récupérer les élèves d'un parent
  static async getByParentId(parentId) {
    try {
      const eleves = await prisma.eleve.findMany({
        where: { parentId },
        orderBy: { nom: 'asc' }
      });
      return eleves;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des élèves du parent: ' + error.message);
    }
  }

  // Récupérer un élève par ID
  static async getById(id) {
    try {
      const eleve = await prisma.eleve.findUnique({
        where: { id },
        include: {
          parent: {
            select: {
              nom: true,
              prenom: true
            }
          }
        }
      });
      
      if (!eleve) return null;
      
      return {
        ...eleve,
        parent_nom: `${eleve.parent.prenom} ${eleve.parent.nom}`
      };
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'élève: ' + error.message);
    }
  }

  // Créer un nouvel élève
  static async create(eleveData) {
    try {
      const { parent_id, nom, prenom, niveau, ecole } = eleveData;
      const eleve = await prisma.eleve.create({
        data: {
          parentId: parent_id,
          nom,
          prenom,
          niveau,
          ecole
        }
      });
      return eleve;
    } catch (error) {
      throw new Error('Erreur lors de la création de l\'élève: ' + error.message);
    }
  }

  // Mettre à jour un élève
  static async update(id, eleveData) {
    try {
      const { nom, prenom, niveau, ecole } = eleveData;
      const eleve = await prisma.eleve.update({
        where: { id },
        data: {
          nom,
          prenom,
          niveau,
          ecole
        }
      });
      return eleve;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour de l\'élève: ' + error.message);
    }
  }

  // Supprimer un élève
  static async delete(id) {
    try {
      await prisma.eleve.delete({
        where: { id }
      });
      return { message: 'Élève supprimé avec succès' };
    } catch (error) {
      throw new Error('Erreur lors de la suppression de l\'élève: ' + error.message);
    }
  }
}

module.exports = Eleve;