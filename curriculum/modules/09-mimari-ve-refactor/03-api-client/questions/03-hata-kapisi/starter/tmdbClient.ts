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
      const response = await fetch(`https://api.themoviedb.org/3${path}`)
      return (await response.json()) as T
    },
  }
}
