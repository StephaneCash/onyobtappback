const router = require('express').Router();
const transaction = require('../controllers/transactionController');

router.post('/', transaction.createTransaction);
router.get('/', transaction.getAllTransactions);
router.put('/:id', transaction.updateTransaction);
router.get('/:id', transaction.getOneTransaction);

module.exports = router;