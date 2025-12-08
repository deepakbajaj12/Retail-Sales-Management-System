const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function buildQuery(state) {
  const params = new URLSearchParams()
  if (state.q) params.set('q', state.q)
  const list = (k) => { (state[k]||[]).forEach(v => params.append(k, v)) }
  list('regions'); list('genders'); list('categories'); list('tags'); list('paymentMethods')
  if (state.ageMin !== '' && state.ageMin != null) params.set('ageMin', state.ageMin)
  if (state.ageMax !== '' && state.ageMax != null) params.set('ageMax', state.ageMax)
  if (state.dateFrom) params.set('dateFrom', state.dateFrom)
  if (state.dateTo) params.set('dateTo', state.dateTo)
  params.set('sort', state.sort || 'date')
  params.set('order', state.order || (state.sort==='date'?'desc':'asc'))
  params.set('page', state.page || 1)
  params.set('pageSize', state.pageSize || 10)
  return params.toString()
}

export async function fetchSales(state) {
  const qs = buildQuery(state)
  const res = await fetch(`${BASE_URL}/api/transactions?${qs}`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}
