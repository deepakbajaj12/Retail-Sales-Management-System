function normalizeRecord(r) {
  const toNumber = (v) => {
    const n = Number(String(v).replace(/[^0-9.-]/g, ''));
    return isNaN(n) ? null : n;
  };
  const toDateTs = (v) => {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d.getTime();
  };

  const tags = r['Tags'] ? String(r['Tags']).split('|').map(s => s.trim()).filter(Boolean) : [];

  return {
    customerId: r['Customer ID'] || null,
    customerName: r['Customer Name'] || null,
    phoneNumber: r['Phone Number'] || null,
    gender: r['Gender'] || null,
    age: toNumber(r['Age']),
    customerRegion: r['Customer Region'] || null,
    customerType: r['Customer Type'] || null,

    productId: r['Product ID'] || null,
    productName: r['Product Name'] || null,
    brand: r['Brand'] || null,
    productCategory: r['Product Category'] || null,
    tags,

    quantity: toNumber(r['Quantity']) || 0,
    pricePerUnit: toNumber(r['Price per Unit']) || 0,
    discountPercentage: toNumber(r['Discount Percentage']) || 0,
    totalAmount: toNumber(r['Total Amount']) || 0,
    finalAmount: toNumber(r['Final Amount']) || 0,

    date: r['Date'] || null,
    dateTs: toDateTs(r['Date']),
    paymentMethod: r['Payment Method'] || null,
    orderStatus: r['Order Status'] || null,
    deliveryType: r['Delivery Type'] || null,
    storeId: r['Store ID'] || null,
    storeLocation: r['Store Location'] || null,
    salespersonId: r['Salesperson ID'] || null,
    employeeName: r['Employee Name'] || null,
  };
}

function buildIndexes(data) {
  // Placeholder for future optimization (e.g., maps by region, tags)
  return {};
}

module.exports = { normalizeRecord, buildIndexes };
