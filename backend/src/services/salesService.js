const { loadData } = require('../utils/dataLoader');
const { normalizeRecord, buildIndexes } = require('../utils/normalize');

let DATA = [];
let INDEXES = null;

async function ensureData() {
  if (DATA.length === 0) {
    const raw = await loadData();
    DATA = raw.map(normalizeRecord);
    INDEXES = buildIndexes(DATA);
  }
}

function matchesSearch(rec, q) {
  if (!q) return true;
  const term = String(q).trim().toLowerCase();
  if (!term) return true;
  return (
    (rec.customerName && rec.customerName.toLowerCase().includes(term)) ||
    (rec.phoneNumber && rec.phoneNumber.toLowerCase().includes(term))
  );
}

function matchesFilters(rec, f) {
  const inList = (list, val) => !list || list.length === 0 || list.includes(val);
  const inRange = (min, max, val) => {
    if (min != null && !isNaN(min) && val < Number(min)) return false;
    if (max != null && !isNaN(max) && val > Number(max)) return false;
    return true;
  };

  if (!inList(f.regions, rec.customerRegion)) return false;
  if (!inList(f.genders, rec.gender)) return false;
  if (!inRange(f.ageMin, f.ageMax, rec.age || 0)) return false;
  if (!inList(f.categories, rec.productCategory)) return false;
  if (f.tags && f.tags.length) {
    const recTags = rec.tags || [];
    const hasAny = f.tags.some(t => recTags.includes(t));
    if (!hasAny) return false;
  }
  if (!inList(f.paymentMethods, rec.paymentMethod)) return false;

  if (f.dateFrom || f.dateTo) {
    const ts = rec.dateTs || 0;
    const fromOk = !f.dateFrom || ts >= f.dateFrom;
    const toOk = !f.dateTo || ts <= f.dateTo;
    if (!(fromOk && toOk)) return false;
  }

  return true;
}

function sortRecords(records, sort, order) {
  const dir = order === 'asc' ? 1 : -1;
  const cmp = (a, b) => {
    let av, bv;
    switch (sort) {
      case 'date':
        av = a.dateTs || 0; bv = b.dateTs || 0; break;
      case 'quantity':
        av = a.quantity || 0; bv = b.quantity || 0; break;
      case 'name':
        av = (a.customerName || '').toLowerCase();
        bv = (b.customerName || '').toLowerCase();
        break;
      default:
        av = 0; bv = 0;
    }
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  };
  return records.sort(cmp);
}

async function querySales(query) {
  await ensureData();

  const q = query.q || '';
  const filters = {
    regions: arr(query.regions),
    genders: arr(query.genders),
    ageMin: num(query.ageMin),
    ageMax: num(query.ageMax),
    categories: arr(query.categories),
    tags: arr(query.tags),
    paymentMethods: arr(query.paymentMethods),
    dateFrom: dateParam(query.dateFrom),
    dateTo: dateParam(query.dateTo),
  };

  const sort = query.sort || 'date';
  const order = query.order || (sort === 'date' ? 'desc' : 'asc');
  const pageSize = Math.min(Number(query.pageSize) || 10, 100);
  const page = Math.max(Number(query.page) || 1, 1);

  let filtered = DATA.filter(r => matchesSearch(r, q) && matchesFilters(r, filters));
  const total = filtered.length;
  filtered = sortRecords(filtered, sort, order);

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize)
  };
}

function arr(v) {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter(Boolean);
  const s = String(v);
  if (!s) return [];
  return s.split(',').map(x => x.trim()).filter(Boolean);
}

function num(v) {
  if (v == null || v === '') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function dateParam(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.getTime();
}

module.exports = { querySales };
