const prisma = require('../config/database');

// GET /api/professeurs - Récupérer tous les professeurs
exports.getAllProfesseurs = async (req, res) => {
  try {
    const professeurs = await prisma.professeur.findMany({
      include: {
        utilisateur: true,
        enseigne: {
          include: {
            matiere: true
          }
        },
        avis: {
          where: {
            statut: 'approuve'
          }
        }
      }
    });

    // Transformer les données pour le frontend
    const professeursTransformed = professeurs.map(prof => {
      const avis = prof.avis || [];
      const noteMoyenne = avis.length > 0 
        ? avis.reduce((sum, a) => sum + a.note, 0) / avis.length 
        : 0;

      return {
        id: prof.id,
        nom: prof.nom,
        prenom: prof.prenom,
        email: prof.email,
        telephone: prof.telephone,
        ville: prof.ville,
        tarif: prof.tarif_horaire,
        bio: prof.biographie,
        dispo: prof.disponibilites,
        matières: prof.enseigne.map(e => e.matiere.nom),
        niveaux: [], // Sera ajouté avec les annonces
        note: noteMoyenne,
        avis: avis.length,
        valide: true,
        photo: `${prof.prenom[0]}${prof.nom[0]}`,
        utilisateurId: prof.utilisateurId
      };
    });
    
    res.json(professeursTransformed);
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/professeurs/:id - Récupérer un professeur par ID
exports.getProfesseurById = async (req, res) => {
  try {
    const professeur = await prisma.professeur.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        utilisateur: true,
        enseigne: {
          include: {
            matiere: true
          }
        },
        avis: {
          where: {
            statut: 'approuve'
          }
        }
      }
    });

    if (!professeur) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }

    const avis = professeur.avis || [];
    const noteMoyenne = avis.length > 0 
      ? avis.reduce((sum, a) => sum + a.note, 0) / avis.length 
      : 0;

    const professeurTransformed = {
      id: professeur.id,
      nom: professeur.nom,
      prenom: professeur.prenom,
      email: professeur.email,
      telephone: professeur.telephone,
      ville: professeur.ville,
      tarif: professeur.tarif_horaire,
      bio: professeur.biographie,
      dispo: professeur.disponibilites,
      matières: professeur.enseigne.map(e => e.matiere.nom),
      niveaux: [],
      note: noteMoyenne,
      avis: avis.length,
      valide: true,
      photo: `${professeur.prenom[0]}${professeur.nom[0]}`,
      utilisateurId: professeur.utilisateurId
    };

    res.json(professeurTransformed);
  } catch (error) {
    console.error('Erreur lors de la récupération du professeur:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/professeurs - Créer un nouveau professeur
exports.createProfesseur = async (req, res) => {
  try {
    const professeur = await Professeur.create(req.body);
    res.status(201).json(professeur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/professeurs/:id - Mettre à jour un professeur
exports.updateProfesseur = async (req, res) => {
  try {
    const professeur = await Professeur.update(req.params.id, req.body);
    res.json(professeur);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/professeurs/:id - Supprimer un professeur
exports.deleteProfesseur = async (req, res) => {
  try {
    const result = await Professeur.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
