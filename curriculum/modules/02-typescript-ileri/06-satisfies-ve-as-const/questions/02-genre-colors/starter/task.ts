export const GENRE_IDS = [18, 53, 35] as const
export type GenreId = (typeof GENRE_IDS)[number]
export const GENRE_COLORS = { 18: 'indigo', 53: 'rose', 35: 'amber' } as const
export function colorFor(id: GenreId): string {
  return ''
}

export const ROUTES = { home: '/', details: '/movie/:id' } as const
export function routeFor(page: 'home' | 'details'): string {
  return ''
}
