const prisma = require('../config/database');

class Seance {
  // Récupérer toutes les séances
  static async getAll() {
    try {
      const seances = await prisma.seance.findMany({
        include: {
          professeur: {
            include: {
              utilisateur: true
            }
          },
          eleve: {
            include: {
              niveau: true
            }
          },
          parent: {
            include: {
              utilisateur: true
            }
          },
          paiement: true
        },
        orderBy: [
          { date_seance: 'desc' },
          { heure_debut: 'desc' }
        ]
      });
      
      return seances.map(seance => ({
        ...seance,
        prof_nom: `${seance.professeur.prenom} ${seance.professeur.nom}`,
        eleve_nom: `${seance.eleve.prenom} ${seance.eleve.nom}`,
        eleve_niveau: seance.eleve.niveau.nom
      }));
    } catch (error) {
      throw new Error('Erreur lors de la récupération des séances: ' + error.message);
    }
  }

  // Récupérer les séances d'un professeur
  static async getByProfesseurId(professeurId) {
    try {
      const seances = await prisma.seance.findMany({
        where: { professeurId: parseInt(professeurId) },
        include: {
          eleve: {
            include: {
              niveau: true,
              parent: {
                include: {
                  utilisateur: true
                }
              }
            }
          },
          parent: {
            include: {
              utilisateur: true
            }
          },
          paiement: true
        },
        orderBy: [
          { date_seance: 'desc' },
          { heure_debut: 'desc' }
        ]
      });
      
      return seances.map(seance => ({
        ...seance,
        eleve_nom: `${seance.eleve.prenom} ${seance.eleve.nom}`,
        eleve_niveau: seance.eleve.niveau.nom,
        parent_nom: `${seance.parent.prenom} ${seance.parent.nom}`
      }));
    } catch (error) {
      throw new Error('Erreur lors de la récupération des séances du professeur: ' + error.message);
    }
  }

  // Récupérer les séances d'un parent
  static async getByParentId(parentId) {
    try {
      const seances = await prisma.seance.findMany({
        where: { parentId: parseInt(parentId) },
        include: {
          professeur: {
            include: {
              utilisateur: true
            }
          },
          eleve: {
            include: {
              niveau: true
            }
          },
          paiement: true
        },
        orderBy: [
          { date_seance: 'desc' },
          { heure_debut: 'desc' }
        ]
      });
      
      return seances.map(seance => ({
        ...seance,
        prof_nom: `${seance.professeur.prenom} ${seance.professeur.nom}`,
        prof_tarif: seance.professeur.tarif_horaire,
        eleve_nom: `${seance.eleve.prenom} ${seance.eleve.nom}`,
        eleve_niveau: seance.eleve.niveau.nom
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
            include: {
              utilisateur: true
            }
          },
          eleve: {
            include: {
              niveau: true,
              parent: {
                include: {
                  utilisateur: true
                }
              }
            }
          },
          parent: {
            include: {
              utilisateur: true
            }
          },
          paiement: true
        }
      });
      
      if (!seance) return null;
      
      return {
        ...seance,
        prof_nom: `${seance.professeur.prenom} ${seance.professeur.nom}`,
        prof_email: seance.professeur.email,
        prof_telephone: seance.professeur.telephone,
        eleve_nom: `${seance.eleve.prenom} ${seance.eleve.nom}`,
        eleve_niveau: seance.eleve.niveau.nom,
        parent_nom: `${seance.parent.prenom} ${seance.parent.nom}`
      };
    } catch (error) {
      throw new Error('Erreur lors de la récupération de la séance: ' + error.message);
    }
  }

  // Créer une nouvelle séance
  static async create(seanceData) {
    try {
      const { professeurId, eleveId, parentId, date_seance, heure_debut, heure_fin, adresse, statut } = seanceData;
      
      // Récupérer le professeur pour calculer le montant
      const professeur = await prisma.professeur.findUnique({
        where: { id: parseInt(professeurId) }
      });

      if (!professeur) {
        throw new Error('Professeur non trouvé');
      }

      // Calculer la durée en heures
      const debut = new Date(`2000-01-01T${heure_debut}`);
      const fin = new Date(`2000-01-01T${heure_fin}`);
      const dureeHeures = (fin - debut) / (1000 * 60 * 60);
      const montant = dureeHeures * professeur.tarif_horaire;

      const seance = await prisma.seance.create({
        data: {
          professeurId: parseInt(professeurId),
          eleveId: parseInt(eleveId),
          parentId: parseInt(parentId),
          date_seance: new Date(date_seance),
          heure_debut,
          heure_fin,
          adresse,
          statut: statut || 'en_attente'
        },
        include: {
          professeur: {
            include: {
              utilisateur: true
            }
          },
          eleve: {
            include: {
              niveau: true
            }
          },
          parent: {
            include: {
              utilisateur: true
            }
          }
        }
      });

      return {
        ...seance,
        montant_calcule: montant,
        prof_nom: `${seance.professeur.prenom} ${seance.professeur.nom}`,
        eleve_nom: `${seance.eleve.prenom} ${seance.eleve.nom}`
      };
    } catch (error) {
      throw new Error('Erreur lors de la création de la séance: ' + error.message);
    }
  }

  // Mettre à jour une séance
  static async update(id, seanceData) {
    try {
      const { statut, date_seance, heure_debut, heure_fin, adresse } = seanceData;
      const seance = await prisma.seance.update({
        where: { id },
        data: {
          statut: statut || undefined,
          date_seance: date_seance ? new Date(date_seance) : undefined,
          heure_debut: heure_debut || undefined,
          heure_fin: heure_fin || undefined,
          adresse: adresse || undefined
        },
        include: {
          professeur: {
            include: {
              utilisateur: true
            }
          },
          eleve: {
            include: {
              niveau: true
            }
          },
          parent: {
            include: {
              utilisateur: true
            }
          },
          paiement: true
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

  // Confirmer une séance
  static async confirmer(id) {
    try {
      const seance = await prisma.seance.update({
        where: { id },
        data: { statut: 'confirmee' }
      });
      return seance;
    } catch (error) {
      throw new Error('Erreur lors de la confirmation de la séance: ' + error.message);
    }
  }

  // Annuler une séance
  static async annuler(id) {
    try {
      const seance = await prisma.seance.update({
        where: { id },
        data: { statut: 'annulee' }
      });
      return seance;
    } catch (error) {
      throw new Error('Erreur lors de l\'annulation de la séance: ' + error.message);
    }
  }

  // Marquer une séance comme réalisée
  static async realisee(id) {
    try {
      const seance = await prisma.seance.update({
        where: { id },
        data: { statut: 'realisee' }
      });
      return seance;
    } catch (error) {
      throw new Error('Erreur lors du marquage de la séance comme réalisée: ' + error.message);
    }
  }
}

module.exports = Seance;