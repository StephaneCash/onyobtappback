const router = require('express').Router();
const compteUser = require('../controllers/compteUserController');

router.get('/:id', compteUser.getUserById);
router.patch('/:id', compteUser.rechargeCompte);

module.exports = router;