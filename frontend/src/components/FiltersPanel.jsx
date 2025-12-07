export default function FiltersPanel({ state, onChange }) {
  const set = (k, v) => onChange({ [k]: v })
  const listInput = (val, setter, placeholder) => (
    <input type="text" placeholder={placeholder} value={(val||[]).join(', ')} onChange={(e) => setter(e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
  )

  return (
    <div className="filters-panel">
      <h3>Filters</h3>
      <label>Customer Region</label>
      {listInput(state.regions, (v)=>set('regions', v), 'e.g., North, South')}
      <label>Gender</label>
      {listInput(state.genders, (v)=>set('genders', v), 'e.g., Male, Female')}
      <label>Age Range</label>
      <div className="row">
        <input type="number" placeholder="Min" value={state.ageMin || ''} onChange={(e)=>set('ageMin', e.target.value?Number(e.target.value):'')} />
        <input type="number" placeholder="Max" value={state.ageMax || ''} onChange={(e)=>set('ageMax', e.target.value?Number(e.target.value):'')} />
      </div>
      <label>Product Category</label>
      {listInput(state.categories, (v)=>set('categories', v), 'e.g., Electronics, Apparel')}
      <label>Tags</label>
      {listInput(state.tags, (v)=>set('tags', v), 'e.g., New, Sale')}
      <label>Payment Method</label>
      {listInput(state.paymentMethods, (v)=>set('paymentMethods', v), 'e.g., Cash, Card')}
      <label>Date Range</label>
      <div className="row">
        <input type="date" value={state.dateFrom || ''} onChange={(e)=>set('dateFrom', e.target.value)} />
        <input type="date" value={state.dateTo || ''} onChange={(e)=>set('dateTo', e.target.value)} />
      </div>
    </div>
  )
}
