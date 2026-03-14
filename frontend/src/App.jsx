import React, { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import FiltersPanel from './components/FiltersPanel'
import SortingDropdown from './components/SortingDropdown'
import TransactionsTable from './components/TransactionsTable'
import PaginationControls from './components/PaginationControls'
import DashboardStats from './components/DashboardStats'
import ExportButton from './components/ExportButton'
import { useQueryState } from './hooks/useQueryState'
import { fetchSales, fetchStats, getExportUrl } from './services/api'

export default function App() {
  const { state, setState, setPage, resetState } = useQueryState()
  const [data, setData] = useState({ items: [], page: 1, pageSize: 10, total: 0, totalPages: 0 })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)

  const activeFilterCount =
    (state.q ? 1 : 0) +
    (state.regions.length ? 1 : 0) +
    (state.genders.length ? 1 : 0) +
    (state.ageMin !== '' ? 1 : 0) +
    (state.ageMax !== '' ? 1 : 0) +
    (state.categories.length ? 1 : 0) +
    (state.tags.length ? 1 : 0) +
    (state.paymentMethods.length ? 1 : 0) +
    (state.dateFrom ? 1 : 0) +
    (state.dateTo ? 1 : 0)

  useEffect(() => {
    setLoading(true)
    setStatsLoading(true)
    fetchSales(state)
      .then(res => setData(res))
      .finally(() => setLoading(false))

    fetchStats(state)
      .then(res => setStats(res))
      .finally(() => setStatsLoading(false))
  }, [state])

  return (
    <div className="container">
      <h1>Retail Sales Management System</h1>
      <SearchBar value={state.q} onChange={(q) => setState({ q })} />
      {statsLoading ? <div>Loading insights...</div> : <DashboardStats stats={stats} />}
      <div className="layout">
        <FiltersPanel
          state={state}
          onChange={setState}
          onReset={resetState}
          activeFilterCount={activeFilterCount}
        />
        <div className="content">
          <div className="content-actions">
            <SortingDropdown sort={state.sort} order={state.order} onChange={(s) => setState(s)} />
            <ExportButton url={getExportUrl(state)} />
          </div>
          {loading ? (<div>Loading...</div>) : (
            <TransactionsTable items={data.items} />
          )}
          <PaginationControls page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
