import React from 'react'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(Number(value || 0))
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Number(value || 0))
}

export default function DashboardStats({ stats }) {
  if (!stats) return null

  return (
    <section className="stats-panel">
      <div className="stats-grid">
        <article className="stat-card">
          <h3>Total Sales</h3>
          <p>{formatCurrency(stats.totalSales)}</p>
        </article>
        <article className="stat-card">
          <h3>Total Transactions</h3>
          <p>{formatNumber(stats.totalTransactions)}</p>
        </article>
        <article className="stat-card">
          <h3>Total Quantity</h3>
          <p>{formatNumber(stats.totalQuantity)}</p>
        </article>
        <article className="stat-card">
          <h3>Average Transaction</h3>
          <p>{formatCurrency(stats.averageTransactionValue)}</p>
        </article>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <h4>Top Categories</h4>
          {(stats.topCategories || []).length === 0 ? (
            <p className="empty-note">No category data for current filters.</p>
          ) : (
            <ul>
              {(stats.topCategories || []).map((entry) => (
                <li key={entry.category}>
                  <span>{entry.category}</span>
                  <strong>{formatCurrency(entry.revenue)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="insight-card">
          <h4>Revenue by Region</h4>
          {(stats.revenueByRegion || []).length === 0 ? (
            <p className="empty-note">No region data for current filters.</p>
          ) : (
            <ul>
              {(stats.revenueByRegion || []).map((entry) => (
                <li key={entry.region}>
                  <span>{entry.region}</span>
                  <strong>{formatCurrency(entry.revenue)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
