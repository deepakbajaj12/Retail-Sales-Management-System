const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getStats,
  getTransaction,
  getFilters,
  exportTransactions
} = require('../controllers/transactionsController');

router.get('/stats', getStats);
router.get('/filters', getFilters);
router.get('/export', exportTransactions);
router.get('/:id', getTransaction);
router.get('/', getTransactions);

module.exports = router;
