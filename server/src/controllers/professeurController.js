const prisma = require('../config/database');

// GET /api/professeurs - Récupérer tous les professeurs
exports.getAllProfesseurs = async (req, res) => {
  try {
    const professeurs = await prisma.professeur.findMany({
      include: {
        utilisateur: true,
        matieres: {
          include: {
            matiere: true
          }
        },
        avisRecus: {
          where: {
            // Pas de filtre sur statut pour le moment
          }
        }
      }
    });

    // Transformer les données pour le frontend
    const professeursTransformed = professeurs.map(prof => {
      const avis = prof.avisRecus || [];
      const noteMoyenne = avis.length > 0 
        ? avis.reduce((sum, a) => sum + a.note, 0) / avis.length 
        : prof.note_moyenne || 0;

      return {
        id: prof.id,
        nom: prof.nom,
        prenom: prof.prenom,
        email: prof.email,
        telephone: prof.telephone,
        ville: prof.ville || 'Non spécifié',
        tarif: prof.tarif_horaire,
        bio: prof.bio,
        dispo: prof.disponibilites,
        matières: prof.matieres.map(e => e.matiere.nom),
        niveaux: [],
        note: noteMoyenne,
        avis: avis.length,
        valide: prof.valide,
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
        matieres: {
          include: {
            matiere: true
          }
        },
        avisRecus: true
      }
    });

    if (!professeur) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }

    const avis = professeur.avisRecus || [];
    const noteMoyenne = avis.length > 0 
      ? avis.reduce((sum, a) => sum + a.note, 0) / avis.length 
      : professeur.note_moyenne || 0;

    const professeurTransformed = {
      id: professeur.id,
      nom: professeur.nom,
      prenom: professeur.prenom,
      email: professeur.email,
      telephone: professeur.telephone,
      ville: professeur.ville || 'Non spécifié',
      tarif: professeur.tarif_horaire,
      bio: professeur.bio,
      dispo: professeur.disponibilites,
      matières: professeur.matieres.map(e => e.matiere.nom),
      niveaux: [],
      note: noteMoyenne,
      avis: avis.length,
      valide: professeur.valide,
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
