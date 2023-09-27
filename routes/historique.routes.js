const router = require('express').Router();
const historiqueController = require('../controllers/historiqueController');

router.get('/:callerId/:calledId', historiqueController.getAllHistoriquesByCalledIdByCallerId);
router.get('/:id', historiqueController.getHistoriqueByCallerId);
router.post('/', historiqueController.createHistorique);
router.delete('/:id', historiqueController.deleteHistorique);

module.exports = router;