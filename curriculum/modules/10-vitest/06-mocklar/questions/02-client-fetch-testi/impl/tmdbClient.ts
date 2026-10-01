const BASE = 'https://api.themoviedb.org/3'
export const tmdbClient = {
  async get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
    const url = new URL(BASE + path)
    url.searchParams.set('language', 'tr-TR')
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value))
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
    if (!response.ok) throw new Error(`TMDB ${response.status}`)
    return response.json() as Promise<T>
  },
}
