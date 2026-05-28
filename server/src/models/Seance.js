const prisma = require('../config/database');

class Seance {
  // Récupérer toutes les séances
  static async getAll() {
    try {
      const seances = await prisma.seance.findMany({
        include: {
          professeur: {
            select: {
              nom: true,
              prenom: true,
              matieres: true
            }
          }
        },
        orderBy: [
          { date: 'desc' },
          { heure: 'desc' }
        ]
      });
      
      return seances.map(seance => ({
        ...seance,
        prof_nom: `${seance.professeur.prenom} ${seance.professeur.nom}`,
        matiere: seance.matiere
      }));
    } catch (error) {
      throw new Error('Erreur lors de la récupération des séances: ' + error.message);
    }
  }

  // Récupérer les séances d'un professeur
  static async getByProfesseurId(profId) {
    try {
      const seances = await prisma.seance.findMany({
        where: { profId },
        include: {
          professeur: {
            select: {
              nom: true,
              prenom: true
            }
          }
        },
        orderBy: [
          { date: 'desc' },
          { heure: 'desc' }
        ]
      });
      
      return seances.map(seance => ({
        ...seance,
        prof_nom: `${seance.professeur.prenom} ${seance.professeur.nom}`
      }));
    } catch (error) {
      throw new Error('Erreur lors de la récupération des séances du professeur: ' + error.message);
    }
  }

  // Récupérer les séances d'un parent (par élève)
  static async getByParentId(parentId) {
    try {
      const seances = await prisma.seance.findMany({
        where: {
          eleve: {
            parentId
          }
        },
        include: {
          professeur: {
            select: {
              nom: true,
              prenom: true
            }
          },
          eleve: true
        },
        orderBy: [
          { date: 'desc' },
          { heure: 'desc' }
        ]
      });
      
      return seances.map(seance => ({
        ...seance,
        prof_nom: `${seance.professeur.prenom} ${seance.professeur.nom}`
      }));
    } catch (error) {
      throw new Error('Erreur lors de la récupération des séances du parent: ' + error.message);
    }
  }

  // Récupérer une séance par ID
  static async getById(id) {
    try {
      const seance = await prisma.seance.findUnique({
        where: { id },
        include: {
          professeur: {
            select: {
              nom: true,
              prenom: true,
              matieres: true
            }
          }
        }
      });
      
      if (!seance) return null;
      
      return {
        ...seance,
        prof_nom: `${seance.professeur.prenom} ${seance.professeur.nom}`,
        matiere: seance.matiere
      };
    } catch (error) {
      throw new Error('Erreur lors de la récupération de la séance: ' + error.message);
    }
  }

  // Créer une nouvelle séance
  static async create(seanceData) {
    try {
      const { prof_id, eleve_id, matiere, niveau, date, heure, duree, montant, statut } = seanceData;
      const seance = await prisma.seance.create({
        data: {
          profId: prof_id,
          eleveId: eleve_id,
          matiere,
          niveau,
          date: new Date(date),
          heure,
          duree: parseInt(duree),
          montant: parseFloat(montant),
          statut: statut || 'en_attente'
        }
      });
      return seance;
    } catch (error) {
      throw new Error('Erreur lors de la création de la séance: ' + error.message);
    }
  }

  // Mettre à jour une séance
  static async update(id, seanceData) {
    try {
      const { statut, date, heure } = seanceData;
      const seance = await prisma.seance.update({
        where: { id },
        data: {
          statut: statut || undefined,
          date: date ? new Date(date) : undefined,
          heure: heure || undefined
        }
      });
      return seance;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour de la séance: ' + error.message);
    }
  }

  // Supprimer une séance
  static async delete(id) {
    try {
      await prisma.seance.delete({
        where: { id }
      });
      return { message: 'Séance supprimée avec succès' };
    } catch (error) {
      throw new Error('Erreur lors de la suppression de la séance: ' + error.message);
    }
  }

  // Mettre à jour le statut d'une séance
  static async updateStatut(id, statut) {
    try {
      const seance = await prisma.seance.update({
        where: { id },
        data: { statut }
      });
      return seance;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du statut: ' + error.message);
    }
  }
}

module.exports = Seance;