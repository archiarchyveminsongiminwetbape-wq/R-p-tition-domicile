const express = require('express');
const router = express.Router();
const annonceController = require('../controllers/annonceController');

// GET /api/annonces
router.get('/', annonceController.getAllAnnonces);

// GET /api/annonces/:id
router.get('/:id', annonceController.getAnnonceById);

// GET /api/annonces/professeur/:profId
router.get('/professeur/:profId', annonceController.getAnnoncesByProfesseur);

// POST /api/annonces
router.post('/', annonceController.createAnnonce);

// PUT /api/annonces/:id
router.put('/:id', annonceController.updateAnnonce);

// PATCH /api/annonces/:id/statut
router.patch('/:id/statut', annonceController.updateAnnonceStatut);

// DELETE /api/annonces/:id
router.delete('/:id', annonceController.deleteAnnonce);

module.exports = router;
