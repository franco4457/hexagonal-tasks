export const isEmpty = (value: unknown): boolean => {
  if (typeof value === 'undefined' || value === null) return true
  if (typeof value === 'number' || typeof value === 'boolean') return false
  if (value instanceof Date) return false
  if (value instanceof Object && Object.keys(value).length === 0) return true
  if (Array.isArray(value)) {
    if (value.length === 0 || value.every((i) => isEmpty(i))) return true
  }
  if (value === '') return true
  return false
}
