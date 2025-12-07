import React from 'react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by Customer Name or Phone Number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
