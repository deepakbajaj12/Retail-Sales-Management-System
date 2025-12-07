const https = require('https');
const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse/sync');

const DATA_URL = process.env.DATA_URL || 'https://drive.google.com/uc?export=download&id=1tzbyuxBmrBwMSXbL22r33FUMtO0V_lxb';
const LOCAL_PATH = process.env.DATA_FILE || path.join(__dirname, '../../data/sales.csv');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch: ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function loadData() {
  // Try local file first for reliability
  if (fs.existsSync(LOCAL_PATH)) {
    const buf = fs.readFileSync(LOCAL_PATH);
    return parseCsv(buf.toString('utf-8'));
  }

  // Fallback to URL
  const buf = await fetchUrl(DATA_URL);
  return parseCsv(buf.toString('utf-8'));
}

function parseCsv(text) {
  const records = csvParse.parse(text, {
    columns: true,
    skip_empty_lines: true
  });
  return records;
}

module.exports = { loadData };
