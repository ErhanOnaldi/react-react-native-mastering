export function requirePage(page: number): number {
  if (!Number.isInteger(page) || page < 1 || page > 500) {
    throw new Error('Geçersiz sayfa')
  }
  return page
}
