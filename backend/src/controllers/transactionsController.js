const { querySales, getDashboardStats, getTransactionById } = require('../services/transactionsService');
const { validateQuery } = require('../utils/validation');

async function getStats(req, res) {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getTransactions(req, res) {
  try {
    const validation = validateQuery(req.query);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    const result = await querySales(req.query);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getTransaction(req, res) {
  try {
    const { id } = req.params;
    const transaction = await getTransactionById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    console.error(err);
    // If invalid ID format (CastError), return 400 or 404
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid transaction ID format' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getTransactions, getStats, getTransaction };
