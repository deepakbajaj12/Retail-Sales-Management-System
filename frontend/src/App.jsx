import React, { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import FiltersPanel from './components/FiltersPanel'
import SortingDropdown from './components/SortingDropdown'
import TransactionsTable from './components/TransactionsTable'
import PaginationControls from './components/PaginationControls'
import { useQueryState } from './hooks/useQueryState'
import { fetchSales } from './services/api'

export default function App() {
  const { state, setState, setPage } = useQueryState()
  const [data, setData] = useState({ items: [], page: 1, pageSize: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchSales(state)
      .then(res => setData(res))
      .finally(() => setLoading(false))
  }, [state])

  return (
    <div className="container">
      <h1>Retail Sales Management System</h1>
      <SearchBar value={state.q} onChange={(q) => setState({ q })} />
      <div className="layout">
        <FiltersPanel state={state} onChange={setState} />
        <div className="content">
          <SortingDropdown sort={state.sort} order={state.order} onChange={(s) => setState(s)} />
          {loading ? (<div>Loading...</div>) : (
            <TransactionsTable items={data.items} />
          )}
          <PaginationControls page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
