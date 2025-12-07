const { querySales } = require('../services/transactionsService');
const { validateQuery } = require('../utils/validation');

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

module.exports = { getTransactions };
