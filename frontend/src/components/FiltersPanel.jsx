import React from 'react'

export default function FiltersPanel({ state, onChange }) {
  const set = (k, v) => onChange({ [k]: v })

  const toggleMulti = (key, value) => {
    const cur = new Set(state[key] || [])
    if (cur.has(value)) cur.delete(value)
    else cur.add(value)
    set(key, Array.from(cur))
  }

  const regions = ['North', 'South', 'East', 'West']
  const genders = ['Male', 'Female', 'Other']
  const categories = ['Electronics', 'Apparel', 'Grocery', 'Home']
  const tags = ['New', 'Sale', 'Hot', 'Featured']
  const paymentMethods = ['Cash', 'Card', 'UPI']

  const renderCheckboxes = (key, options) => (
    <div className="checkbox-group">
      {options.map(opt => (
        <label key={opt} className="checkbox-item">
          <input
            type="checkbox"
            checked={(state[key] || []).includes(opt)}
            onChange={() => toggleMulti(key, opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  )

  return (
    <div className="filters-panel">
      <h3>Filters</h3>
      <label>Customer Region</label>
      {renderCheckboxes('regions', regions)}

      <label>Gender</label>
      {renderCheckboxes('genders', genders)}

      <label>Age Range</label>
      <div className="row">
        <input type="number" placeholder="Min" value={state.ageMin || ''} onChange={(e)=>set('ageMin', e.target.value?Number(e.target.value):'')} />
        <input type="number" placeholder="Max" value={state.ageMax || ''} onChange={(e)=>set('ageMax', e.target.value?Number(e.target.value):'')} />
      </div>

      <label>Product Category</label>
      {renderCheckboxes('categories', categories)}

      <label>Tags</label>
      {renderCheckboxes('tags', tags)}

      <label>Payment Method</label>
      {renderCheckboxes('paymentMethods', paymentMethods)}

      <label>Date Range</label>
      <div className="row">
        <input type="date" value={state.dateFrom || ''} onChange={(e)=>set('dateFrom', e.target.value)} />
        <input type="date" value={state.dateTo || ''} onChange={(e)=>set('dateTo', e.target.value)} />
      </div>
    </div>
  )
}
