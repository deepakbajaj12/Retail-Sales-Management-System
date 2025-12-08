const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const transactionsRoutes = require('./routes/transactionsRoutes');
const salesRoutes = require('./routes/sales');
const { connectMongo } = require('./config/db');

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

async function start() {
  try {
    await connectMongo();

    // Primary routes
    app.use('/sales', salesRoutes);
    app.use('/api/transactions', salesRoutes); // alias

    // Debug sample from DB
    const { Transaction } = require('./models/Transaction');
    app.get('/debug/transactions-sample', async (req, res) => {
      try {
        const sample = await Transaction.find({}).sort({ dateTs: -1 }).limit(5).lean();
        const total = await Transaction.estimatedDocumentCount();
        res.json({ sample, total });
      } catch (e) {
        res.status(500).json({ error: 'Debug sample failed' });
      }
    });

    const port = process.env.PORT || 4000;
    const server = app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('Shutting down...');
      server.close(() => process.exit(0));
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

start();
