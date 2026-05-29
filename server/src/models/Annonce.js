const prisma = require('../config/database');

class Annonce {
  // Récupérer toutes les annonces actives
  static async getAll() {
    try {
      const annonces = await prisma.annonce.findMany({
        where: { statut: 'active' },
        include: {
          professeur: {
            include: {
              utilisateur: true
            }
          },
          matiere: true,
          niveaux: {
            include: {
              niveau: true
            }
          }
        },
        orderBy: { date_creation: 'desc' }
      });
      
      return annonces.map(annonce => ({
        ...annonce,
        prof_nom: `${annonce.professeur.prenom} ${annonce.professeur.nom}`,
        prof_tarif: annonce.professeur.tarif_horaire,
        prof_note: annonce.professeur.note_moyenne,
        niveaux_list: annonce.niveaux.map(n => n.niveau.nom)
      }));
    } catch (error) {
      throw new Error('Erreur lors de la récupération des annonces: ' + error.message);
    }
  }

  // Récupérer les annonces d'un professeur
  static async getByProfesseurId(professeurId) {
    try {
      const annonces = await prisma.annonce.findMany({
        where: { professeurId: parseInt(professeurId) },
        include: {
          matiere: true,
          niveaux: {
            include: {
              niveau: true
            }
          }
        },
        orderBy: { date_creation: 'desc' }
      });
      
      return annonces.map(annonce => ({
        ...annonce,
        niveaux_list: annonce.niveaux.map(n => n.niveau.nom)
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
            include: {
              utilisateur: true,
              matieres: {
                include: {
                  matiere: true
                }
              },
              avisRecus: true
            }
          },
          matiere: true,
          niveaux: {
            include: {
              niveau: true
            }
          }
        }
      });
      
      if (!annonce) return null;
      
      return {
        ...annonce,
        prof_nom: `${annonce.professeur.prenom} ${annonce.professeur.nom}`,
        prof_email: annonce.professeur.email,
        prof_telephone: annonce.professeur.telephone,
        prof_tarif: annonce.professeur.tarif_horaire,
        prof_note: annonce.professeur.note_moyenne,
        prof_bio: annonce.professeur.bio,
        prof_disponibilites: annonce.professeur.disponibilites,
        prof_photo: annonce.professeur.photo,
        prof_matieres: annonce.professeur.matieres.map(m => m.matiere.nom),
        niveaux_list: annonce.niveaux.map(n => n.niveau.nom)
      };
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'annonce: ' + error.message);
    }
  }

  // Créer une nouvelle annonce
  static async create(annonceData) {
    try {
      const { professeurId, titre, description, tarif, matiereId, niveaux } = annonceData;
      const annonce = await prisma.annonce.create({
        data: {
          professeurId: parseInt(professeurId),
          titre,
          description,
          tarif: parseFloat(tarif),
          matiereId: parseInt(matiereId),
          date_creation: new Date()
        }
      });

      // Ajouter les niveaux ciblés
      if (niveaux && Array.isArray(niveaux)) {
        for (const niveauId of niveaux) {
          await prisma.annonceNiveau.create({
            data: {
              annonceId: annonce.id,
              niveauId: parseInt(niveauId)
            }
          });
        }
      }

      return await this.getById(annonce.id);
    } catch (error) {
      throw new Error('Erreur lors de la création de l\'annonce: ' + error.message);
    }
  }

  // Mettre à jour une annonce
  static async update(id, annonceData) {
    try {
      const { titre, description, tarif, matiereId, niveaux, statut } = annonceData;
      const annonce = await prisma.annonce.update({
        where: { id },
        data: {
          titre: titre || undefined,
          description: description || undefined,
          tarif: tarif ? parseFloat(tarif) : undefined,
          matiereId: matiereId ? parseInt(matiereId) : undefined,
          statut: statut || undefined
        }
      });

      // Mise à jour des niveaux si fournis
      if (niveaux && Array.isArray(niveaux)) {
        // Supprimer les anciennes relations
        await prisma.annonceNiveau.deleteMany({
          where: { annonceId: id }
        });

        // Créer les nouvelles relations
        for (const niveauId of niveaux) {
          await prisma.annonceNiveau.create({
            data: {
              annonceId: id,
              niveauId: parseInt(niveauId)
            }
          });
        }
      }

      return await this.getById(id);
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

  // Filtrer les annonces par matière et niveau
  static async filter(filters) {
    try {
      const { matiereId, niveauId, minTarif, maxTarif } = filters;
      const where = { statut: 'active' };

      if (matiereId) {
        where.matiereId = parseInt(matiereId);
      }

      if (niveauId) {
        where.niveaux = {
          some: {
            niveauId: parseInt(niveauId)
          }
        };
      }

      if (minTarif || maxTarif) {
        where.tarif = {};
        if (minTarif) where.tarif.gte = parseFloat(minTarif);
        if (maxTarif) where.tarif.lte = parseFloat(maxTarif);
      }

      const annonces = await prisma.annonce.findMany({
        where,
        include: {
          professeur: {
            include: {
              utilisateur: true
            }
          },
          matiere: true,
          niveaux: {
            include: {
              niveau: true
            }
          }
        },
        orderBy: { date_creation: 'desc' }
      });
      
      return annonces.map(annonce => ({
        ...annonce,
        prof_nom: `${annonce.professeur.prenom} ${annonce.professeur.nom}`,
        prof_tarif: annonce.professeur.tarif_horaire,
        prof_note: annonce.professeur.note_moyenne,
        niveaux_list: annonce.niveaux.map(n => n.niveau.nom)
      }));
    } catch (error) {
      throw new Error('Erreur lors du filtrage des annonces: ' + error.message);
    }
  }
}

module.exports = Annonce;