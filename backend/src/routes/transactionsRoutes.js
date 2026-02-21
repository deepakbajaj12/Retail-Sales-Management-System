const express = require('express');
const router = express.Router();
const { getTransactions, getStats } = require('../controllers/transactionsController');

router.get('/stats', getStats);
router.get('/', getTransactions);

module.exports = router;
