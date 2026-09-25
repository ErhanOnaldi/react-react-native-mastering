export const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
export type TmdbParams = Record<string, string | number | undefined>

export class ApiError extends Error {
  readonly status: number
  readonly statusCode: number | null

  constructor(status: number, statusCode: number | null, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.statusCode = statusCode
  }
}

function buildUrl(path: string, params: TmdbParams): string {
  const url = new URL(`${TMDB_BASE_URL}/${path.replace(/^\/+/, '')}`)
  url.searchParams.set('language', 'tr-TR')
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url.toString()
}

export const tmdbClient = {
  async get<T>(path: string, params: TmdbParams = {}): Promise<T> {
    const response = await fetch(buildUrl(path, params), {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null)
      const details =
        body && typeof body === 'object'
          ? (body as Record<string, unknown>)
          : null
      const statusCode =
        typeof details?.status_code === 'number' ? details.status_code : null
      const message =
        typeof details?.status_message === 'string'
          ? details.status_message
          : `TMDB isteği başarısız (HTTP ${response.status})`
      throw new ApiError(response.status, statusCode, message)
    }
    return (await response.json()) as T
  },
}
