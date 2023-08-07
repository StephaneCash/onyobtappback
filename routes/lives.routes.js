const router = require('express').Router();
const liveController = require('../controllers/liveController');

router.post('/', liveController.createLive);
router.get('/', liveController.getAllLives);
router.put('/:id', liveController.updateLive);
router.get('/:id', liveController.updateLive);
router.delete('/:id', liveController.deleteLive);

module.exports = router;