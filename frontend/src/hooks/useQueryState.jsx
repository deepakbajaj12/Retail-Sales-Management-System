import { useState } from 'react'

export function useQueryState() {
  const [state, _setState] = useState({
    q: '',
    regions: [],
    genders: [],
    ageMin: '',
    ageMax: '',
    categories: [],
    tags: [],
    paymentMethods: [],
    dateFrom: '',
    dateTo: '',
    sort: 'date',
    order: 'desc',
    page: 1,
    pageSize: 10
  })
  const setState = (changes) => {
    _setState(prev => ({ ...prev, ...changes, page: 1 }))
  }
  const setPage = (page) => {
    _setState(prev => ({ ...prev, page }))
  }
  return { state, setState, setPage }
}
