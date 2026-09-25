export function readMovieTitle(raw: unknown): string | null {
  if (typeof raw !== 'object' || raw === null || !('title' in raw)) return null
  return typeof raw.title === 'string' ? raw.title : null
}
