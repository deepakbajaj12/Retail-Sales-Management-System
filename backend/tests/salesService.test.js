module.exports = async function() {
  const { querySales } = require('../src/services/salesService')
  const { loadData } = require('../src/utils/dataLoader')
  const { normalizeRecord } = require('../src/utils/normalize')

  // Seed in-memory data by touching querySales once (it calls ensureData)
  // To avoid remote fetch dependency, create a temporary local dataset if missing.
  const fs = require('fs'); const path = require('path');
  const local = path.join(__dirname, '../data/sales.csv')
  if (!fs.existsSync(local)) {
    fs.mkdirSync(path.dirname(local), { recursive: true })
    fs.writeFileSync(local, [
      'Customer ID,Customer Name,Phone Number,Gender,Age,Customer Region,Customer Type,Product ID,Product Name,Brand,Product Category,Tags,Quantity,Price per Unit,Discount Percentage,Total Amount,Final Amount,Date,Payment Method,Order Status,Delivery Type,Store ID,Store Location,Salesperson ID,Employee Name',
      'C1,John Doe,1234567890,Male,30,North,Regular,P1,Laptop,BrandA,Electronics,New|Sale,2,500,10,1000,900,2025-01-02,Cash,Completed,Home,S1,CityA,SP1,Alice',
      'C2,Jane Smith,5551112222,Female,25,South,VIP,P2,Phone,BrandB,Electronics,Hot|Featured,1,800,0,800,800,2025-02-15,Card,Completed,Store,S2,CityB,SP2,Bob',
      'C3,Alan,9876543210,Male,45,East,Regular,P3,Shirt,BrandC,Apparel,Sale,3,30,0,90,90,2024-12-20,UPI,Pending,Store,S3,CityC,SP3,Carol'
    ].join('\n'))
  }

  // Basic query
  const res1 = await querySales({ page: 1, pageSize: 10 })
  if (!(res1.total >= 3)) throw new Error('Expected at least 3 records')

  // Search by name
  const res2 = await querySales({ q: 'john', page: 1, pageSize: 10 })
  if (!(res2.items.length === 1 && res2.items[0].customerName === 'John Doe')) throw new Error('Search by name failed')

  // Filter by region multi-select
  const res3 = await querySales({ regions: ['North','South'], page: 1, pageSize: 10 })
  if (!(res3.items.every(i => ['North','South'].includes(i.customerRegion)))) throw new Error('Region filter failed')

  // Age range
  const res4 = await querySales({ ageMin: 26, ageMax: 50, page: 1, pageSize: 10 })
  if (!(res4.items.every(i => i.age >= 26 && i.age <= 50))) throw new Error('Age range filter failed')

  // Tags filter (any match)
  const res5 = await querySales({ tags: ['Sale'], page: 1, pageSize: 10 })
  if (!(res5.items.every(i => (i.tags||[]).includes('Sale')))) throw new Error('Tags filter failed')

  // Payment method
  const res6 = await querySales({ paymentMethods: ['Card'], page: 1, pageSize: 10 })
  if (!(res6.items.every(i => i.paymentMethod === 'Card'))) throw new Error('Payment method filter failed')

  // Date range
  const res7 = await querySales({ dateFrom: '2025-01-01', dateTo: '2025-12-31', page: 1, pageSize: 10 })
  if (!(res7.items.every(i => i.dateTs >= new Date('2025-01-01').getTime() && i.dateTs <= new Date('2025-12-31').getTime()))) throw new Error('Date range filter failed')

  // Sorting by name asc
  const res8 = await querySales({ sort: 'name', order: 'asc', page: 1, pageSize: 10 })
  const names = res8.items.map(i => (i.customerName||'').toLowerCase())
  const sorted = [...names].sort()
  if (names.join('|') !== sorted.join('|')) throw new Error('Sorting by name asc failed')

  // Pagination retains state (use category filter)
  const res9a = await querySales({ categories: ['Electronics'], page: 1, pageSize: 1 })
  const res9b = await querySales({ categories: ['Electronics'], page: 2, pageSize: 1 })
  if (!(res9a.items.length === 1 && res9b.items.length === 1)) throw new Error('Pagination failed')
}
