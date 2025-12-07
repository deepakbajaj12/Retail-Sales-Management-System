import React from 'react'

export default function SortingDropdown({ sort, order, onChange }) {
  const update = (changes) => onChange({ ...changes })
  return (
    <div className="sorting-dropdown">
      <select value={sort || 'date'} onChange={(e) => update({ sort: e.target.value })}>
        <option value="date">Date (Newest First)</option>
        <option value="quantity">Quantity</option>
        <option value="name">Customer Name (A–Z)</option>
      </select>
      <select value={order || (sort==='date'?'desc':'asc')} onChange={(e) => update({ order: e.target.value })}>
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
    </div>
  )
}
