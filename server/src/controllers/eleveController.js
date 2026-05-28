const Eleve = require('../models/Eleve');

// GET /api/eleves - Récupérer tous les élèves
exports.getAllEleves = async (req, res) => {
  try {
    const eleves = await Eleve.getAll();
    res.json(eleves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/eleves/:id - Récupérer un élève par ID
exports.getEleveById = async (req, res) => {
  try {
    const eleve = await Eleve.getById(req.params.id);
    if (!eleve) {
      return res.status(404).json({ error: 'Élève non trouvé' });
    }
    res.json(eleve);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/eleves/parent/:parentId - Récupérer les élèves d'un parent
exports.getElevesByParent = async (req, res) => {
  try {
    const eleves = await Eleve.getByParentId(req.params.parentId);
    res.json(eleves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/eleves - Créer un nouvel élève
exports.createEleve = async (req, res) => {
  try {
    const eleve = await Eleve.create(req.body);
    res.status(201).json(eleve);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/eleves/:id - Mettre à jour un élève
exports.updateEleve = async (req, res) => {
  try {
    const eleve = await Eleve.update(req.params.id, req.body);
    res.json(eleve);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/eleves/:id - Supprimer un élève
exports.deleteEleve = async (req, res) => {
  try {
    const result = await Eleve.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
