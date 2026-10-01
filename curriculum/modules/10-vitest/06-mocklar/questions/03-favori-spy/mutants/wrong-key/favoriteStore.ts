const KEY = 'favorites'
export function addFavorite(id: number): void {
  const existing = JSON.parse(localStorage.getItem(KEY) ?? '[]') as number[]
  if (!existing.includes(id)) localStorage.setItem(KEY, JSON.stringify([...existing, id]))
}
