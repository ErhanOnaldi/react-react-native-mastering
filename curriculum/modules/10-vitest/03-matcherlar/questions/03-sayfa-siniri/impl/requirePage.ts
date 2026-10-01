export function requirePage(page: number): number {
  if (!Number.isInteger(page) || page < 1 || page > 500) {
    throw new RangeError('Sayfa 1 ile 500 arasında olmalı')
  }
  return page
}
