const express = require('express');
const cors = require('cors');
const { loadCSV } = require('./utils/csvLoader');
const transactionsRoutes = require('./routes/transactionsRoutes');
const salesRoutes = require('./routes/sales');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = __dirname + '/../data/sales.csv';

loadCSV(DATA_PATH).then(data => {
  console.log('CSV loaded records:', data.length);
  app.locals.transactions = data;

  try {
    // Primary routes
    app.use('/sales', salesRoutes);
    console.log('Mounted /sales');

    // Alias to support alternate path expectations
    app.use('/api/transactions', salesRoutes);
    console.log('Mounted alias /api/transactions -> /sales');
  } catch (e) {
    console.error('Failed to mount transactionsRoutes:', e);
  }

  // Health endpoint
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.get('/debug/transactions-sample', (req, res) => {
    const sample = (app.locals.transactions || []).slice(0, 5);
    res.json({ sample, total: (app.locals.transactions || []).length });
  });

  // Optional debug sample endpoint (kept for local troubleshooting)

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to load CSV:', err);
  process.exit(1);
});
