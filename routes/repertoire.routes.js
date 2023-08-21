const router = require('express').Router();
const repertoireController = require('../controllers/repertoireController');

router.post('/', repertoireController.createRep);
router.get('/', repertoireController.getAllNums);
router.put('/:id', repertoireController.updateNum);
router.get('/:id', repertoireController.getOneNum);
router.delete('/:id', repertoireController.deleteRep);

module.exports = router;