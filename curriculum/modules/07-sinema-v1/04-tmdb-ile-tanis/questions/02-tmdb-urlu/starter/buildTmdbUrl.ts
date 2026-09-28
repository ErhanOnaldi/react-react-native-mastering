export type TmdbParams = Record<string, string | number | undefined>

export function buildTmdbUrl(path: string, params: TmdbParams = {}): string {
  return `https://api.themoviedb.org/3/${path.replace(/^\/+/, '')}`
}
