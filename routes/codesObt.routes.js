const router = require('express').Router();
const codeObtController = require('../controllers/codeObtController');

router.post('/', codeObtController.create);
router.get('/', codeObtController.getAllCodes);
router.get('/copies', codeObtController.getAllCodesCopies);
router.put('/:id', codeObtController.updateCode);
router.delete('/:id', codeObtController.deleteCodeObt);
router.patch('/delete/many', codeObtController.deleManyCode);

module.exports = router;