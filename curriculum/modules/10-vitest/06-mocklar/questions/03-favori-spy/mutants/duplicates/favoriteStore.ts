const KEY = 'favoriteIds'
export function addFavorite(id: number): void {
  const existing = JSON.parse(localStorage.getItem(KEY) ?? '[]') as number[]
  localStorage.setItem(KEY, JSON.stringify([...existing, id]))
}
