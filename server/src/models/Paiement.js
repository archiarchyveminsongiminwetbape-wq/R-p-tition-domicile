const prisma = require('../config/database');

class Paiement {
  // Récupérer tous les paiements
  static async getAll() {
    try {
      const paiements = await prisma.paiement.findMany({
        include: {
          seance: {
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
          }
        },
        orderBy: { date_paiement: 'desc' }
      });
      return paiements;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des paiements: ' + error.message);
    }
  }

  // Récupérer un paiement par ID
  static async getById(id) {
    try {
      const paiement = await prisma.paiement.findUnique({
        where: { id },
        include: {
          seance: {
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
          }
        }
      });
      return paiement;
    } catch (error) {
      throw new Error('Erreur lors de la récupération du paiement: ' + error.message);
    }
  }

  // Créer un nouveau paiement
  static async create(paiementData) {
    try {
      const { seanceId, montant, mode_paiement } = paiementData;
      
      // Récupérer la séance
      const seance = await prisma.seance.findUnique({
        where: { id: parseInt(seanceId) },
        include: {
          professeur: true
        }
      });

      if (!seance) {
        throw new Error('Séance non trouvée');
      }

      // Calculer le montant si non fourni
      const montantFinal = montant || seance.montant;

      const paiement = await prisma.paiement.create({
        data: {
          seanceId: parseInt(seanceId),
          montant: parseFloat(montantFinal),
          mode_paiement,
          statut: 'en_attente'
        },
        include: {
          seance: {
            include: {
              professeur: true,
              eleve: true,
              parent: true
            }
          }
        }
      });

      return paiement;
    } catch (error) {
      throw new Error('Erreur lors de la création du paiement: ' + error.message);
    }
  }

  // Mettre à jour le statut d'un paiement
  static async updateStatut(id, statut) {
    try {
      const paiement = await prisma.paiement.update({
        where: { id },
        data: { 
          statut,
          date_paiement: statut === 'effectue' ? new Date() : undefined
        },
        include: {
          seance: {
            include: {
              professeur: true,
              eleve: true,
              parent: true
            }
          }
        }
      });
      return paiement;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du statut du paiement: ' + error.message);
    }
  }

  // Récupérer les paiements d'un parent
  static async getByParentId(parentId) {
    try {
      const paiements = await prisma.paiement.findMany({
        where: {
          seance: {
            parentId: parseInt(parentId)
          }
        },
        include: {
          seance: {
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
              }
            }
          }
        },
        orderBy: { date_paiement: 'desc' }
      });
      return paiements;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des paiements du parent: ' + error.message);
    }
  }

  // Récupérer les paiements d'un professeur
  static async getByProfesseurId(professeurId) {
    try {
      const paiements = await prisma.paiement.findMany({
        where: {
          seance: {
            professeurId: parseInt(professeurId)
          }
        },
        include: {
          seance: {
            include: {
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
          }
        },
        orderBy: { date_paiement: 'desc' }
      });
      return paiements;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des paiements du professeur: ' + error.message);
    }
  }
}

module.exports = Paiement;