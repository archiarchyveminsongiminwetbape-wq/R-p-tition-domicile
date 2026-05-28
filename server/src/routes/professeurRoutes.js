const express = require('express');
const router = express.Router();
const professeurController = require('../controllers/professeurController');

// GET /api/professeurs
router.get('/', professeurController.getAllProfesseurs);

// GET /api/professeurs/:id
router.get('/:id', professeurController.getProfesseurById);

// POST /api/professeurs
router.post('/', professeurController.createProfesseur);

// PUT /api/professeurs/:id
router.put('/:id', professeurController.updateProfesseur);

// DELETE /api/professeurs/:id
router.delete('/:id', professeurController.deleteProfesseur);

module.exports = router;
