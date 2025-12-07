module.exports = async function() {
  const { validateQuery } = require('../src/utils/validation')

  const ok = validateQuery({ page: 1, pageSize: 10, sort: 'date', order: 'desc' })
  if (!ok.valid) throw new Error('Expected valid query')

  const badNum = validateQuery({ ageMin: 'abc' })
  if (badNum.valid) throw new Error('Expected invalid ageMin')

  const badRange = validateQuery({ ageMin: 50, ageMax: 20 })
  if (badRange.valid) throw new Error('Expected invalid age range')

  const badSort = validateQuery({ sort: 'foobar' })
  if (badSort.valid) throw new Error('Expected invalid sort')

  const badOrder = validateQuery({ order: 'up' })
  if (badOrder.valid) throw new Error('Expected invalid order')
}
