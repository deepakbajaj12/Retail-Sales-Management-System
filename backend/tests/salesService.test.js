const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Transaction } = require('../src/models/Transaction');
const { querySales } = require('../src/services/salesService');

module.exports = async function() {
  // Start in-memory Mongo
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);

  // Seed data
  const docs = [
    {
      customerId: 'C1', customerName: 'John Doe', phoneNumber: '1234567890', gender: 'Male', age: 30,
      customerRegion: 'North', customerType: 'Regular',
      productId: 'P1', productName: 'Laptop', brand: 'BrandA', productCategory: 'Electronics', tags: ['New', 'Sale'],
      quantity: 2, pricePerUnit: 500, discountPercentage: 10, totalAmount: 1000, finalAmount: 900,
      date: '2025-01-02', dateTs: new Date('2025-01-02').getTime(),
      paymentMethod: 'Cash', orderStatus: 'Completed', deliveryType: 'Home',
      storeId: 'S1', storeLocation: 'CityA', salespersonId: 'SP1', employeeName: 'Alice'
    },
    {
      customerId: 'C2', customerName: 'Jane Smith', phoneNumber: '5551112222', gender: 'Female', age: 25,
      customerRegion: 'South', customerType: 'VIP',
      productId: 'P2', productName: 'Phone', brand: 'BrandB', productCategory: 'Electronics', tags: ['Hot', 'Featured'],
      quantity: 1, pricePerUnit: 800, discountPercentage: 0, totalAmount: 800, finalAmount: 800,
      date: '2025-02-15', dateTs: new Date('2025-02-15').getTime(),
      paymentMethod: 'Card', orderStatus: 'Completed', deliveryType: 'Store',
      storeId: 'S2', storeLocation: 'CityB', salespersonId: 'SP2', employeeName: 'Bob'
    },
    {
      customerId: 'C3', customerName: 'Alan', phoneNumber: '9876543210', gender: 'Male', age: 45,
      customerRegion: 'East', customerType: 'Regular',
      productId: 'P3', productName: 'Shirt', brand: 'BrandC', productCategory: 'Apparel', tags: ['Sale'],
      quantity: 3, pricePerUnit: 30, discountPercentage: 0, totalAmount: 90, finalAmount: 90,
      date: '2024-12-20', dateTs: new Date('2024-12-20').getTime(),
      paymentMethod: 'UPI', orderStatus: 'Pending', deliveryType: 'Store',
      storeId: 'S3', storeLocation: 'CityC', salespersonId: 'SP3', employeeName: 'Carol'
    }
  ];

  await Transaction.insertMany(docs);

  try {
    // Basic query
    const res1 = await querySales({ page: 1, pageSize: 10 });
    if (res1.total !== 3) throw new Error('Expected 3 records, got ' + res1.total);

    // Search by name
    const res2 = await querySales({ q: 'john', page: 1, pageSize: 10 });
    if (!(res2.items.length === 1 && res2.items[0].customerName === 'John Doe')) throw new Error('Search by name failed');

    // Filter by region multi-select
    const res3 = await querySales({ regions: ['North','South'], page: 1, pageSize: 10 });
    if (res3.items.length !== 2) throw new Error('Region filter failed count');
    if (!res3.items.every(i => ['North','South'].includes(i.customerRegion))) throw new Error('Region filter failed match');

    // Age range
    const res4 = await querySales({ ageMin: 26, ageMax: 50, page: 1, pageSize: 10 });
    if (res4.items.length !== 2) throw new Error('Age range filter failed count'); // John(30), Alan(45)

    // Tags filter
    const res5 = await querySales({ tags: ['Sale'], page: 1, pageSize: 10 });
    if (res5.items.length !== 2) throw new Error('Tags filter failed count'); // John(New,Sale), Alan(Sale)

    // Payment method
    const res6 = await querySales({ paymentMethods: ['Card'], page: 1, pageSize: 10 });
    if (res6.items.length !== 1 || res6.items[0].paymentMethod !== 'Card') throw new Error('Payment method filter failed');

    // Date range
    const res7 = await querySales({ dateFrom: '2025-01-01', dateTo: '2025-12-31', page: 1, pageSize: 10 });
    if (res7.items.length !== 2) throw new Error('Date range filter failed count'); // John(Jan), Jane(Feb)

    // Sorting by name asc
    const res8 = await querySales({ sort: 'name', order: 'asc', page: 1, pageSize: 10 });
    const names = res8.items.map(i => i.customerName);
    if (names[0] !== 'Alan' || names[1] !== 'Jane Smith' || names[2] !== 'John Doe') throw new Error('Sorting by name asc failed: ' + names.join(','));

    // Pagination
    // Electronics: John, Jane. Page 1 -> 1 item. Page 2 -> 1 item.
    const res9a = await querySales({ categories: ['Electronics'], page: 1, pageSize: 1 });
    const res9b = await querySales({ categories: ['Electronics'], page: 2, pageSize: 1 });
    if (res9a.items.length !== 1 || res9b.items.length !== 1) throw new Error('Pagination failed');
    if (res9a.items[0].productId === res9b.items[0].productId) throw new Error('Pagination returned same item');

  } finally {
    await mongoose.disconnect();
    await mongod.stop();
  }
};
