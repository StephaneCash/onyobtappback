const router = require('express').Router();
const listConnexionController = require('../controllers/listConnexionController');

router.post('/', listConnexionController.createConnexion);
router.get('/', listConnexionController.getAllConnexion);
router.put('/:id', listConnexionController.updateConnexion);
router.get('/:userId', listConnexionController.getConnexionsByUserId);
router.delete('/:id', listConnexionController.delteConnexions);

module.exports = router;