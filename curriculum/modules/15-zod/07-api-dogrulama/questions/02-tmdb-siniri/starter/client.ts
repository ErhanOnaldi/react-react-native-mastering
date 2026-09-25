import { z } from 'zod'
const TMDB_BASE = 'https://api.themoviedb.org/3'
const schema = z.object({ id: z.number(), title: z.string() })
export async function getMovie(path: string): Promise<z.infer<typeof schema>> {
  const response = await fetch(`${TMDB_BASE}${path}`, {
    headers: { Authorization: 'Bearer test-token' },
  })
  return (await response.json()) as z.infer<typeof schema>
}
