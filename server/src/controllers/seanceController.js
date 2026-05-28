const Seance = require('../models/Seance');

// GET /api/seances - Récupérer toutes les séances
exports.getAllSeances = async (req, res) => {
  try {
    const seances = await Seance.getAll();
    res.json(seances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/seances/:id - Récupérer une séance par ID
exports.getSeanceById = async (req, res) => {
  try {
    const seance = await Seance.getById(req.params.id);
    if (!seance) {
      return res.status(404).json({ error: 'Séance non trouvée' });
    }
    res.json(seance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/seances/professeur/:profId - Récupérer les séances d'un professeur
exports.getSeancesByProfesseur = async (req, res) => {
  try {
    const seances = await Seance.getByProfesseurId(req.params.profId);
    res.json(seances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/seances/parent/:parentId - Récupérer les séances d'un parent
exports.getSeancesByParent = async (req, res) => {
  try {
    const seances = await Seance.getByParentId(req.params.parentId);
    res.json(seances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/seances - Créer une nouvelle séance
exports.createSeance = async (req, res) => {
  try {
    const seance = await Seance.create(req.body);
    res.status(201).json(seance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/seances/:id - Mettre à jour une séance
exports.updateSeance = async (req, res) => {
  try {
    const seance = await Seance.update(req.params.id, req.body);
    res.json(seance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/seances/:id/statut - Mettre à jour le statut d'une séance
exports.updateSeanceStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const seance = await Seance.updateStatut(req.params.id, statut);
    res.json(seance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/seances/:id - Supprimer une séance
exports.deleteSeance = async (req, res) => {
  try {
    const result = await Seance.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
