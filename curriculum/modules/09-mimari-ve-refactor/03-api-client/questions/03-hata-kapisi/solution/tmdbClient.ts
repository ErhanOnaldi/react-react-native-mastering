export class ApiError extends Error {
  constructor(
    public status: number,
    public statusCode: number | null,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type Params = Record<string, string | number | undefined>

export function createTmdbClient(token: string) {
  return {
    async get<T>(path: string, params: Params = {}): Promise<T> {
      const url = new URL(`https://api.themoviedb.org/3${path}`)
      url.searchParams.set('language', 'tr-TR')
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) url.searchParams.set(key, String(value))
      }
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          status_code?: number
          status_message?: string
        } | null
        throw new ApiError(
          response.status,
          body?.status_code ?? null,
          body?.status_message ?? `TMDB isteği başarısız (${response.status})`,
        )
      }
      return (await response.json()) as T
    },
  }
}
