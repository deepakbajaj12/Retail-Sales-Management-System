function validateQuery(q) {
  const errors = [];
  const numFields = ['ageMin', 'ageMax', 'page', 'pageSize'];
  numFields.forEach(f => {
    if (q[f] != null && q[f] !== '') {
      const n = Number(q[f]);
      if (isNaN(n)) errors.push(`${f} must be a number`);
    }
  });

  if (q.pageSize && Number(q.pageSize) <= 0) errors.push('pageSize must be > 0');
  if (q.page && Number(q.page) <= 0) errors.push('page must be >= 1');

  const sortAllowed = ['date', 'quantity', 'name'];
  if (q.sort && !sortAllowed.includes(q.sort)) errors.push('invalid sort');

  const orderAllowed = ['asc', 'desc'];
  if (q.order && !orderAllowed.includes(q.order)) errors.push('invalid order');

  if (q.ageMin != null && q.ageMax != null) {
    const min = Number(q.ageMin), max = Number(q.ageMax);
    if (!isNaN(min) && !isNaN(max) && min > max) errors.push('ageMin cannot exceed ageMax');
  }

  if (errors.length) return { valid: false, error: errors.join('; ') };
  return { valid: true };
}

module.exports = { validateQuery };
