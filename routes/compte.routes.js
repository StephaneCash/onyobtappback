const router = require('express').Router();
const compteUser = require('../controllers/compteUserController');

router.get('/:id', compteUser.getUserById);

module.exports = router;