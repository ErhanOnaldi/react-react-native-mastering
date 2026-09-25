export type Params = Record<string, string | number | undefined>

export function buildTmdbUrl(path: string, params: Params = {}): string {
  return `https://api.themoviedb.org/3${path}`
}
