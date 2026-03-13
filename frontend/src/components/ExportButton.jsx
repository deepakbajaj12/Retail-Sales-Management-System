import React from 'react'

export default function ExportButton({ url }) {
  return (
    <a className="export-btn" href={url}>
      Export CSV
    </a>
  )
}
