export const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export type TmdbParams = Record<string, string | number | undefined>

export function buildTmdbUrl(path: string, params: TmdbParams = {}): string {
  const url = new URL(`${TMDB_BASE_URL}/${path.replace(/^\/+/, '')}`)
  const search = new URLSearchParams({ language: 'tr-TR' })
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value))
  }
  url.search = search.toString()
  return url.toString()
}

export async function tmdbFetch<T>(
  path: string,
  params: TmdbParams = {},
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(buildTmdbUrl(path, params), {
    ...init,
    headers: {
      ...Object.fromEntries(new Headers(init.headers).entries()),
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      status_code?: number
      status_message?: string
    } | null
    throw new Error(body?.status_message ?? `TMDB HTTP ${response.status}`)
  }
  return (await response.json()) as T
}
