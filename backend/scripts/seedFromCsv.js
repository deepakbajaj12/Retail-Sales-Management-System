#!/usr/bin/env node
/*
 Seed MongoDB with transactions from CSV at data/sales.csv
 Usage: node scripts/seedFromCsv.js
 Requires MONGODB_URI in environment (.env)
*/
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { connectMongo } = require('../src/config/db');
const { Transaction } = require('../src/models/Transaction');
const { parse } = require('csv-parse/sync');
const { normalizeRecord } = require('../src/utils/normalize');

(async function main() {
  try {
    await connectMongo();
    const csvPath = path.join(__dirname, '..', 'data', 'sales.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('CSV not found at', csvPath);
      process.exit(1);
    }
    const text = fs.readFileSync(csvPath, 'utf-8');
    const rows = parse(text, { columns: true, skip_empty_lines: true });
    const docs = rows.map(normalizeRecord);

    // Optional: clear collection before seed
    await Transaction.deleteMany({});
    const batchSize = 1000;
    for (let i = 0; i < docs.length; i += batchSize) {
      const slice = docs.slice(i, i + batchSize);
      await Transaction.insertMany(slice, { ordered: false });
      console.log(`Inserted ${Math.min(i + batchSize, docs.length)} / ${docs.length}`);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (e) {
    console.error('Seed failed:', e);
    process.exit(1);
  }
})();
