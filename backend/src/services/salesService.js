const { Transaction } = require('../models/Transaction');

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

async function querySales(query) {
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

  const sortKey = query.sort || 'date';
  const order = (query.order || (sortKey === 'date' ? 'desc' : 'asc')).toLowerCase();
  const pageSize = Math.min(Number(query.pageSize) || 10, 100);
  const page = Math.max(Number(query.page) || 1, 1);

  // Build Mongo filter
  const mongoFilter = {};

  if (q && q.trim()) {
    const regex = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    mongoFilter.$or = [
      { customerName: regex },
      { phoneNumber: regex },
    ];
  }
  if (filters.regions.length) mongoFilter.customerRegion = { $in: filters.regions };
  if (filters.genders.length) mongoFilter.gender = { $in: filters.genders };
  if (filters.categories.length) mongoFilter.productCategory = { $in: filters.categories };
  if (filters.paymentMethods.length) mongoFilter.paymentMethod = { $in: filters.paymentMethods };
  if (filters.tags.length) mongoFilter.tags = { $in: filters.tags };
  if (filters.ageMin != null || filters.ageMax != null) {
    mongoFilter.age = {};
    if (filters.ageMin != null) mongoFilter.age.$gte = filters.ageMin;
    if (filters.ageMax != null) mongoFilter.age.$lte = filters.ageMax;
  }
  if (filters.dateFrom != null || filters.dateTo != null) {
    mongoFilter.dateTs = {};
    if (filters.dateFrom != null) mongoFilter.dateTs.$gte = filters.dateFrom;
    if (filters.dateTo != null) mongoFilter.dateTs.$lte = filters.dateTo;
  }

  // Sorting map
  const sortMap = {
    date: { dateTs: order === 'asc' ? 1 : -1 },
    quantity: { quantity: order === 'asc' ? 1 : -1 },
    name: { customerName: order === 'asc' ? 1 : -1 },
  };
  const mongoSort = sortMap[sortKey] || sortMap.date;

  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    Transaction.find(mongoFilter).sort(mongoSort).skip(skip).limit(pageSize).lean(),
    Transaction.countDocuments(mongoFilter),
  ]);

  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

module.exports = { querySales };
