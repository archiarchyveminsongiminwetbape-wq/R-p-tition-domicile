const prisma = require('../config/database');

class Annonce {
  // Récupérer toutes les annonces
  static async getAll() {
    try {
      const annonces = await prisma.annonce.findMany({
        include: {
          professeur: {
            select: {
              nom: true,
              prenom: true
            }
          },
          _count: {
            select: {
              professeur: {
                select: {
                  seances: true
                }
              }
            }
          }
        },
        orderBy: { date: 'desc' }
      });
      
      return annonces.map(annonce => ({
        ...annonce,
        prof_nom: `${annonce.professeur.prenom} ${annonce.professeur.nom}`,
        nombre_seances: annonce._count.professeur.seances.length
      }));
    } catch (error) {
      throw new Error('Erreur lors de la récupération des annonces: ' + error.message);
    }
  }

  // Récupérer les annonces d'un professeur
  static async getByProfesseurId(profId) {
    try {
      const annonces = await prisma.annonce.findMany({
        where: { profId },
        include: {
          professeur: {
            include: {
              seances: true
            }
          }
        },
        orderBy: { date: 'desc' }
      });
      
      return annonces.map(annonce => ({
        ...annonce,
        nombre_seances: annonce.professeur.seances.length
      }));
    } catch (error) {
      throw new Error('Erreur lors de la récupération des annonces du professeur: ' + error.message);
    }
  }

  // Récupérer une annonce par ID
  static async getById(id) {
    try {
      const annonce = await prisma.annonce.findUnique({
        where: { id },
        include: {
          professeur: {
            select: {
              nom: true,
              prenom: true,
              photo: true,
              tarif: true,
              seances: true
            }
          }
        }
      });
      
      if (!annonce) return null;
      
      return {
        ...annonce,
        prof_nom: `${annonce.professeur.prenom} ${annonce.professeur.nom}`,
        prof_photo: annonce.professeur.photo,
        prof_tarif: annonce.professeur.tarif,
        nombre_seances: annonce.professeur.seances.length
      };
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'annonce: ' + error.message);
    }
  }

  // Créer une nouvelle annonce
  static async create(annonceData) {
    try {
      const { prof_id, titre, matiere, niveaux, tarif, statut } = annonceData;
      const annonce = await prisma.annonce.create({
        data: {
          profId: prof_id,
          titre,
          matiere,
          niveaux,
          tarif: parseFloat(tarif),
          statut: statut || 'active',
          date: new Date()
        }
      });
      return annonce;
    } catch (error) {
      throw new Error('Erreur lors de la création de l\'annonce: ' + error.message);
    }
  }

  // Mettre à jour une annonce
  static async update(id, annonceData) {
    try {
      const { titre, matiere, niveaux, tarif, statut } = annonceData;
      const annonce = await prisma.annonce.update({
        where: { id },
        data: {
          titre: titre || undefined,
          matiere: matiere || undefined,
          niveaux: niveaux || undefined,
          tarif: tarif ? parseFloat(tarif) : undefined,
          statut: statut || undefined
        }
      });
      return annonce;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour de l\'annonce: ' + error.message);
    }
  }

  // Supprimer une annonce
  static async delete(id) {
    try {
      await prisma.annonce.delete({
        where: { id }
      });
      return { message: 'Annonce supprimée avec succès' };
    } catch (error) {
      throw new Error('Erreur lors de la suppression de l\'annonce: ' + error.message);
    }
  }

  // Mettre à jour le statut d'une annonce
  static async updateStatut(id, statut) {
    try {
      const annonce = await prisma.annonce.update({
        where: { id },
        data: { statut }
      });
      return annonce;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du statut: ' + error.message);
    }
  }
}

module.exports = Annonce;