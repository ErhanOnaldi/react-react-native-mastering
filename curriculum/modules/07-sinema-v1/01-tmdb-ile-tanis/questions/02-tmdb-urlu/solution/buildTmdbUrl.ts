export type TmdbParams = Record<string, string | number | undefined>

export function buildTmdbUrl(path: string, params: TmdbParams = {}): string {
  const url = new URL(`https://api.themoviedb.org/3/${path.replace(/^\/+/, '')}`)
  const search = new URLSearchParams({ language: 'tr-TR' })
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value))
  }
  url.search = search.toString()
  return url.toString()
}
