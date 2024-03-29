const router = require('express').Router();
const compteUser = require('../controllers/compteUserController');

router.get('/', compteUser.getAllComptes);
router.get('/:id', compteUser.getUserById);
router.get('/single/:id', compteUser.getAccountByNumero);
router.patch('/:id', compteUser.rechargeCompte);
router.put('/:id', compteUser.updateCompte);
router.patch('/reduce/:id', compteUser.reduceCompte);
router.patch('/add-solde/:id', compteUser.addSoldeCompte);
router.patch('/compare-pin/:id', compteUser.comparePin);
router.post('/transfert', compteUser.transfertObt);

module.exports = router;