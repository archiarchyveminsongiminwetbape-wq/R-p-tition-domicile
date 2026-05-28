const express = require('express');
const router = express.Router();
const seanceController = require('../controllers/seanceController');

// GET /api/seances
router.get('/', seanceController.getAllSeances);

// GET /api/seances/:id
router.get('/:id', seanceController.getSeanceById);

// GET /api/seances/professeur/:profId
router.get('/professeur/:profId', seanceController.getSeancesByProfesseur);

// GET /api/seances/parent/:parentId
router.get('/parent/:parentId', seanceController.getSeancesByParent);

// POST /api/seances
router.post('/', seanceController.createSeance);

// PUT /api/seances/:id
router.put('/:id', seanceController.updateSeance);

// PATCH /api/seances/:id/statut
router.patch('/:id/statut', seanceController.updateSeanceStatut);

// DELETE /api/seances/:id
router.delete('/:id', seanceController.deleteSeance);

module.exports = router;
