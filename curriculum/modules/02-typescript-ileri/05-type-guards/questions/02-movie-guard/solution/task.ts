export type MovieBrief = { id: number; title: string; poster_path: string | null }
export function isMovieBrief(value: unknown): value is MovieBrief {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  if (!('id' in value) || !('title' in value) || !('poster_path' in value)) return false
  return typeof value.id === 'number' && typeof value.title === 'string' && (typeof value.poster_path === 'string' || value.poster_path === null)
}
