const prisma = require('../config/database');

class Professeur {
  // Récupérer tous les professeurs
  static async getAll() {
    try {
      const professeurs = await prisma.professeur.findMany({
        where: { valide: true },
        orderBy: { note_moyenne: 'desc' },
        include: {
          matieres: {
            include: {
              matiere: true
            }
          },
          utilisateur: true
        }
      });
      return professeurs;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des professeurs: ' + error.message);
    }
  }

  // Récupérer un professeur par ID
  static async getById(id) {
    try {
      const professeur = await prisma.professeur.findUnique({
        where: { id },
        include: {
          matieres: {
            include: {
              matiere: true
            }
          },
          avisRecus: true,
          annonces: {
            include: {
              matiere: true,
              niveaux: {
                include: {
                  niveau: true
                }
              }
            }
          },
          utilisateur: true
        }
      });
      return professeur;
    } catch (error) {
      throw new Error('Erreur lors de la récupération du professeur: ' + error.message);
    }
  }

  // Récupérer les professeurs par matière
  static async getByMatiere(matiereId) {
    try {
      const professeurs = await prisma.professeur.findMany({
        where: {
          valide: true,
          matieres: {
            some: {
              matiereId: parseInt(matiereId)
            }
          }
        },
        orderBy: { note_moyenne: 'desc' },
        include: {
          matieres: {
            include: {
              matiere: true
            }
          },
          utilisateur: true
        }
      });
      return professeurs;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des professeurs par matière: ' + error.message);
    }
  }

  // Récupérer les professeurs par niveau
  static async getByNiveau(niveauId) {
    try {
      const professeurs = await prisma.professeur.findMany({
        where: {
          valide: true,
          annonces: {
            some: {
              niveaux: {
                some: {
                  niveauId: parseInt(niveauId)
                }
              }
            }
          }
        },
        orderBy: { note_moyenne: 'desc' },
        include: {
          matieres: {
            include: {
              matiere: true
            }
          },
          utilisateur: true
        }
      });
      return professeurs;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des professeurs par niveau: ' + error.message);
    }
  }

  // Mettre à jour un professeur
  static async update(id, professeurData) {
    try {
      const { nom, prenom, email, telephone, tarif_horaire, bio, disponibilites, photo, matieres } = professeurData;
      const professeur = await prisma.professeur.update({
        where: { id },
        data: {
          nom,
          prenom,
          email,
          telephone,
          tarif_horaire: tarif_horaire ? parseFloat(tarif_horaire) : undefined,
          bio,
          disponibilites,
          photo
        }
      });

      // Mise à jour des matières si fournies
      if (matieres && Array.isArray(matieres)) {
        // Supprimer les anciennes relations
        await prisma.enseigne.deleteMany({
          where: { professeurId: id }
        });

        // Créer les nouvelles relations
        for (const matiereId of matieres) {
          await prisma.enseigne.create({
            data: {
              professeurId: id,
              matiereId: parseInt(matiereId)
            }
          });
        }
      }

      return await this.getById(id);
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du professeur: ' + error.message);
    }
  }

  // Valider un professeur
  static async validate(id) {
    try {
      const professeur = await prisma.professeur.update({
        where: { id },
        data: { valide: true }
      });
      return professeur;
    } catch (error) {
      throw new Error('Erreur lors de la validation du professeur: ' + error.message);
    }
  }

  // Calculer la note moyenne d'un professeur
  static async recalculateNote(professeurId) {
    try {
      const avis = await prisma.avis.findMany({
        where: { professeurId }
      });

      if (avis.length === 0) {
        await prisma.professeur.update({
          where: { id: professeurId },
          data: { note_moyenne: 0 }
        });
        return 0;
      }

      const total = avis.reduce((sum, avis) => sum + avis.note, 0);
      const moyenne = total / avis.length;

      await prisma.professeur.update({
        where: { id: professeurId },
        data: { note_moyenne: moyenne }
      });

      return moyenne;
    } catch (error) {
      throw new Error('Erreur lors du calcul de la note moyenne: ' + error.message);
    }
  }
}

module.exports = Professeur;