const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  customerId: String,
  customerName: { type: String, index: true },
  phoneNumber: { type: String, index: true },
  gender: String,
  age: Number,
  customerRegion: { type: String, index: true },
  customerType: String,

  productId: String,
  productName: String,
  brand: String,
  productCategory: { type: String, index: true },
  tags: { type: [String], index: true },

  quantity: Number,
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,

  date: String,
  dateTs: { type: Number, index: true },
  paymentMethod: { type: String, index: true },
  orderStatus: String,
  deliveryType: String,
  storeId: String,
  storeLocation: String,
  salespersonId: String,
  employeeName: String,
}, { timestamps: false });

TransactionSchema.index({ customerName: 1, phoneNumber: 1 });

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = { Transaction };
