const prisma = require('../config/database');
const Professeur = require('./Professeur');

class Avis {
  // Récupérer tous les avis
  static async getAll() {
    try {
      const avis = await prisma.avis.findMany({
        include: {
          professeur: {
            include: {
              utilisateur: true
            }
          },
          parent: {
            include: {
              utilisateur: true
            }
          }
        },
        orderBy: { date_avis: 'desc' }
      });
      return avis;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des avis: ' + error.message);
    }
  }

  // Récupérer les avis d'un professeur
  static async getByProfesseurId(professeurId) {
    try {
      const avis = await prisma.avis.findMany({
        where: { professeurId: parseInt(professeurId) },
        include: {
          parent: {
            include: {
              utilisateur: true
            }
          }
        },
        orderBy: { date_avis: 'desc' }
      });
      return avis;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des avis du professeur: ' + error.message);
    }
  }

  // Récupérer un avis par ID
  static async getById(id) {
    try {
      const avis = await prisma.avis.findUnique({
        where: { id },
        include: {
          professeur: {
            include: {
              utilisateur: true
            }
          },
          parent: {
            include: {
              utilisateur: true
            }
          }
        }
      });
      return avis;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'avis: ' + error.message);
    }
  }

  // Créer un nouvel avis
  static async create(avisData) {
    try {
      const { professeurId, parentId, note, commentaire } = avisData;
      
      // Vérifier si le parent a déjà laissé un avis pour ce professeur
      const existingAvis = await prisma.avis.findUnique({
        where: {
          professeurId_parentId: {
            professeurId: parseInt(professeurId),
            parentId: parseInt(parentId)
          }
        }
      });

      if (existingAvis) {
        // Mettre à jour l'avis existant
        const avis = await prisma.avis.update({
          where: { id: existingAvis.id },
          data: {
            note: parseInt(note),
            commentaire,
            date_avis: new Date()
          }
        });
      } else {
        // Créer un nouvel avis
        await prisma.avis.create({
          data: {
            professeurId: parseInt(professeurId),
            parentId: parseInt(parentId),
            note: parseInt(note),
            commentaire,
            date_avis: new Date()
          }
        });
      }

      // Recalculer la note moyenne du professeur
      await Professeur.recalculateNote(parseInt(professeurId));

      return await this.getByProfesseurId(parseInt(professeurId));
    } catch (error) {
      throw new Error('Erreur lors de la création de l\'avis: ' + error.message);
    }
  }

  // Mettre à jour un avis
  static async update(id, avisData) {
    try {
      const { note, commentaire } = avisData;
      const avis = await prisma.avis.update({
        where: { id },
        data: {
          note: note ? parseInt(note) : undefined,
          commentaire: commentaire || undefined
        },
        include: {
          professeur: {
            include: {
              utilisateur: true
            }
          },
          parent: {
            include: {
              utilisateur: true
            }
          }
        }
      });

      // Recalculer la note moyenne du professeur
      await Professeur.recalculateNote(avis.professeurId);

      return avis;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour de l\'avis: ' + error.message);
    }
  }

  // Supprimer un avis
  static async delete(id) {
    try {
      const avis = await prisma.avis.findUnique({
        where: { id }
      });

      if (avis) {
        const professeurId = avis.professeurId;
        await prisma.avis.delete({
          where: { id }
        });

        // Recalculer la note moyenne du professeur
        await Professeur.recalculateNote(professeurId);
      }

      return { message: 'Avis supprimé avec succès' };
    } catch (error) {
      throw new Error('Erreur lors de la suppression de l\'avis: ' + error.message);
    }
  }
}

module.exports = Avis;