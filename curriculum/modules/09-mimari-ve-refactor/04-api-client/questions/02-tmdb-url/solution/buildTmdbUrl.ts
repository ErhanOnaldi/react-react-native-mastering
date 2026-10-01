export type Params = Record<string, string | number | undefined>

export function buildTmdbUrl(path: string, params: Params = {}): string {
  const url = new URL(`https://api.themoviedb.org/3${path}`)
  url.searchParams.set('language', 'tr-TR')
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url.toString()
}
