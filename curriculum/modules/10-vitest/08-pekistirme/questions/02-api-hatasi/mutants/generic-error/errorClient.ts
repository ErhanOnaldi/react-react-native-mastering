const BASE = 'https://api.themoviedb.org/3'
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
export async function getMovie(id: number): Promise<{ id: number; title: string }> {
  const response = await fetch(`${BASE}/movie/${id}`, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
  })
  const data = (await response.json()) as {
    id?: number
    title?: string
    status_code?: number
    status_message?: string
  }
  if (!response.ok) throw new ApiError(response.status, 0, 'TMDB hatası')
  return { id: data.id!, title: data.title! }
}
