const Professeur = require('../models/Professeur');

// GET /api/professeurs - Récupérer tous les professeurs
exports.getAllProfesseurs = async (req, res) => {
  try {
    const { matiere, niveau } = req.query;
    
    let professeurs;
    if (matiere) {
      professeurs = await Professeur.getByMatiere(matiere);
    } else if (niveau) {
      professeurs = await Professeur.getByNiveau(niveau);
    } else {
      professeurs = await Professeur.getAll();
    }
    
    res.json(professeurs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/professeurs/:id - Récupérer un professeur par ID
exports.getProfesseurById = async (req, res) => {
  try {
    const professeur = await Professeur.getById(req.params.id);
    if (!professeur) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }
    res.json(professeur);
  } catch (error) {
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
