import { useState } from 'react'

function createInitialState() {
  return {
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
  }
}

export function useQueryState() {
  const [state, _setState] = useState(createInitialState())

  const setState = (changes) => {
    _setState(prev => ({ ...prev, ...changes, page: 1 }))
  }

  const setPage = (page) => {
    _setState(prev => ({ ...prev, page }))
  }

  const resetState = () => {
    _setState(createInitialState())
  }

  return { state, setState, setPage, resetState }
}
