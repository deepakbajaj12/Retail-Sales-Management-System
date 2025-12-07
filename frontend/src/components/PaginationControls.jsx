import React from 'react'

export default function PaginationControls({ page, totalPages, onPageChange }) {
  return (
    <div className="pagination-controls">
      <button disabled={page<=1} onClick={()=>onPageChange(page-1)}>Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button disabled={page>=totalPages} onClick={()=>onPageChange(page+1)}>Next</button>
    </div>
  )
}
