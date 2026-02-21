const express = require('express');
const router = express.Router();
const { getTransactions, getStats, getTransaction } = require('../controllers/transactionsController');

router.get('/stats', getStats);
router.get('/:id', getTransaction);
router.get('/', getTransactions);

module.exports = router;
