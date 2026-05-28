const express = require('express');
const router = express.Router();
const eleveController = require('../controllers/eleveController');

// GET /api/eleves
router.get('/', eleveController.getAllEleves);

// GET /api/eleves/:id
router.get('/:id', eleveController.getEleveById);

// GET /api/eleves/parent/:parentId
router.get('/parent/:parentId', eleveController.getElevesByParent);

// POST /api/eleves
router.post('/', eleveController.createEleve);

// PUT /api/eleves/:id
router.put('/:id', eleveController.updateEleve);

// DELETE /api/eleves/:id
router.delete('/:id', eleveController.deleteEleve);

module.exports = router;
