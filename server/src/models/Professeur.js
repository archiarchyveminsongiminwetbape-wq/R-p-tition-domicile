const prisma = require('../config/database');

class Professeur {
  // Récupérer tous les professeurs
  static async getAll() {
    try {
      const professeurs = await prisma.professeur.findMany({
        where: { valide: true },
        orderBy: { note: 'desc' },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          tarif: true,
          note: true,
          avis: true,
          ville: true,
          photo: true,
          matieres: true,
          niveaux: true,
          bio: true,
          dispo: true,
          valide: true
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
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          tarif: true,
          note: true,
          avis: true,
          ville: true,
          photo: true,
          matieres: true,
          niveaux: true,
          bio: true,
          dispo: true,
          valide: true
        }
      });
      return professeur;
    } catch (error) {
      throw new Error('Erreur lors de la récupération du professeur: ' + error.message);
    }
  }

  // Récupérer les professeurs par matière
  static async getByMatiere(matiere) {
    try {
      const professeurs = await prisma.professeur.findMany({
        where: {
          valide: true,
          matieres: {
            has: matiere
          }
        },
        orderBy: { note: 'desc' },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          tarif: true,
          note: true,
          avis: true,
          ville: true,
          photo: true,
          matieres: true,
          niveaux: true,
          bio: true,
          dispo: true,
          valide: true
        }
      });
      return professeurs;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des professeurs par matière: ' + error.message);
    }
  }

  // Récupérer les professeurs par niveau
  static async getByNiveau(niveau) {
    try {
      const professeurs = await prisma.professeur.findMany({
        where: {
          valide: true,
          niveaux: {
            has: niveau
          }
        },
        orderBy: { note: 'desc' },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          tarif: true,
          note: true,
          avis: true,
          ville: true,
          photo: true,
          matieres: true,
          niveaux: true,
          bio: true,
          dispo: true,
          valide: true
        }
      });
      return professeurs;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des professeurs par niveau: ' + error.message);
    }
  }

  // Créer un nouveau professeur
  static async create(professeurData) {
    try {
      const { nom, prenom, email, tarif, ville, matieres, niveaux, bio, dispo } = professeurData;
      const professeur = await prisma.professeur.create({
        data: {
          nom,
          prenom,
          email,
          tarif: parseFloat(tarif),
          ville,
          matieres,
          niveaux,
          bio,
          dispo,
          note: 0,
          avis: 0,
          valide: false
        }
      });
      return professeur;
    } catch (error) {
      throw new Error('Erreur lors de la création du professeur: ' + error.message);
    }
  }

  // Mettre à jour un professeur
  static async update(id, professeurData) {
    try {
      const { nom, prenom, email, tarif, ville, matieres, niveaux, bio, dispo } = professeurData;
      const professeur = await prisma.professeur.update({
        where: { id },
        data: {
          nom,
          prenom,
          email,
          tarif: tarif ? parseFloat(tarif) : undefined,
          ville,
          matieres,
          niveaux,
          bio,
          dispo
        }
      });
      return professeur;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du professeur: ' + error.message);
    }
  }

  // Supprimer un professeur
  static async delete(id) {
    try {
      await prisma.professeur.delete({
        where: { id }
      });
      return { message: 'Professeur supprimé avec succès' };
    } catch (error) {
      throw new Error('Erreur lors de la suppression du professeur: ' + error.message);
    }
  }
}

module.exports = Professeur;