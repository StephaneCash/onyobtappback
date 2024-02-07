const router = require('express').Router();
const canalController = require('../controllers/canalController');

router.post('/', canalController.create);
router.get('/', canalController.getAll);
router.patch('/:id', canalController.addNum);
router.delete('/:id', canalController.deleteCanal);
router.patch('/delete/:id', canalController.removeNum);

module.exports = router;