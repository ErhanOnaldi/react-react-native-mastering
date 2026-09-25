import { z } from 'zod'
const TMDB_BASE = 'https://api.themoviedb.org/3'
const schema = z.object({ id: z.number().int(), title: z.string().min(1) })
export async function getMovie(path: string): Promise<z.infer<typeof schema>> {
  const response = await fetch(`${TMDB_BASE}${path}`, {
    headers: { Authorization: 'Bearer test-token' },
  })
  if (!response.ok) throw new Error(`TMDB HTTP ${response.status}`)
  const raw: unknown = await response.json()
  return schema.parse(raw)
}
