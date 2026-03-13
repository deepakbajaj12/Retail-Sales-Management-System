const { Transaction } = require('../models/Transaction');

const { stringify } = require('csv-stringify');

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

function buildMongoFilter(query) {
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
  return mongoFilter;
}

async function querySales(query) {
  const mongoFilter = buildMongoFilter(query);
  const sortKey = query.sort || 'date';
  const order = (query.order || (sortKey === 'date' ? 'desc' : 'asc')).toLowerCase();
  const pageSize = Math.min(Number(query.pageSize) || 10, 100);
  const page = Math.max(Number(query.page) || 1, 1);

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

async function getDashboardStats(query = {}) {
  const mongoFilter = buildMongoFilter(query);
  const matchStage = Object.keys(mongoFilter).length ? [{ $match: mongoFilter }] : [];

  const [totalSalesResult, totalQuantityResult, totalTransactions, topCategories, revenueByRegion] = await Promise.all([
    Transaction.aggregate([
      ...matchStage,
      { $group: { _id: null, totalAmount: { $sum: '$finalAmount' } } }
    ]),
    Transaction.aggregate([
      ...matchStage,
      { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } }
    ]),
    Transaction.countDocuments(mongoFilter),
    Transaction.aggregate([
      ...matchStage,
      { $group: { _id: '$productCategory', revenue: { $sum: '$finalAmount' }, transactions: { $sum: 1 } } },
      { $project: { _id: 0, category: '$_id', revenue: 1, transactions: 1 } },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]),
    Transaction.aggregate([
      ...matchStage,
      { $group: { _id: '$customerRegion', revenue: { $sum: '$finalAmount' } } },
      { $project: { _id: 0, region: '$_id', revenue: 1 } },
      { $sort: { revenue: -1 } }
    ])
  ]);

  const totalSales = totalSalesResult[0]?.totalAmount || 0;
  const totalQuantity = totalQuantityResult[0]?.totalQuantity || 0;

  return {
    totalSales,
    totalTransactions,
    totalQuantity,
    averageTransactionValue: totalTransactions > 0 ? totalSales / totalTransactions : 0,
    topCategories,
    revenueByRegion
  };
}

async function getTransactionById(id) {
  return await Transaction.findById(id);
}

async function getFilterOptions() {
  const [regions, categories, paymentMethods, storeLocations] = await Promise.all([
    Transaction.distinct('customerRegion'),
    Transaction.distinct('productCategory'),
    Transaction.distinct('paymentMethod'),
    Transaction.distinct('storeLocation')
  ]);

  return {
    regions: regions.filter(Boolean).sort(),
    categories: categories.filter(Boolean).sort(),
    paymentMethods: paymentMethods.filter(Boolean).sort(),
    storeLocations: storeLocations.filter(Boolean).sort()
  };
}

function exportSalesStream(query) {
  const mongoFilter = buildMongoFilter(query);
  const cursor = Transaction.find(mongoFilter).lean().cursor();
  
  const stringifier = stringify({
    header: true,
    columns: [
      'customerName', 'phoneNumber', 'gender', 'age', 'customerRegion', 
      'productCategory', 'productName', 'quantity', 'finalAmount', 
      'orderStatus', 'date', 'paymentMethod'
    ]
  });

  cursor.pipe(stringifier);
  return stringifier;
}

module.exports = { querySales, getDashboardStats, getTransactionById, getFilterOptions, exportSales: exportSalesStream };
