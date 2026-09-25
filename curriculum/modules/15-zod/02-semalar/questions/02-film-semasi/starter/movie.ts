import { z } from 'zod'

export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
})
export function parseMovie(raw: unknown) {
  return movieSchema.parse(raw)
}
