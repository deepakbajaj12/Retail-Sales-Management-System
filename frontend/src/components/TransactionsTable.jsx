import React from 'react'

export default function TransactionsTable({ items }) {
  if (!items || items.length === 0) {
    return <div>No results found.</div>
  }
  return (
    <table className="transactions-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Customer Name</th>
          <th>Phone</th>
          <th>Region</th>
          <th>Product</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Final Amount</th>
          <th>Payment</th>
        </tr>
      </thead>
      <tbody>
        {items.map((r, idx) => (
          <tr key={idx}>
            <td>{r.date}</td>
            <td>{r.customerName}</td>
            <td>{r.phoneNumber}</td>
            <td>{r.customerRegion}</td>
            <td>{r.productName}</td>
            <td>{r.productCategory}</td>
            <td>{r.quantity}</td>
            <td>{r.finalAmount}</td>
            <td>{r.paymentMethod}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
