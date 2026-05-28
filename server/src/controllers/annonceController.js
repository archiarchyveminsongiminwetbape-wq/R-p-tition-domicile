const Annonce = require('../models/Annonce');

// GET /api/annonces - Récupérer toutes les annonces
exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.getAll();
    res.json(annonces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/annonces/:id - Récupérer une annonce par ID
exports.getAnnonceById = async (req, res) => {
  try {
    const annonce = await Annonce.getById(req.params.id);
    if (!annonce) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }
    res.json(annonce);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/annonces/professeur/:profId - Récupérer les annonces d'un professeur
exports.getAnnoncesByProfesseur = async (req, res) => {
  try {
    const annonces = await Annonce.getByProfesseurId(req.params.profId);
    res.json(annonces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/annonces - Créer une nouvelle annonce
exports.createAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.create(req.body);
    res.status(201).json(annonce);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/annonces/:id - Mettre à jour une annonce
exports.updateAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.update(req.params.id, req.body);
    res.json(annonce);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/annonces/:id/statut - Mettre à jour le statut d'une annonce
exports.updateAnnonceStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const annonce = await Annonce.updateStatut(req.params.id, statut);
    res.json(annonce);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/annonces/:id - Supprimer une annonce
exports.deleteAnnonce = async (req, res) => {
  try {
    const result = await Annonce.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
