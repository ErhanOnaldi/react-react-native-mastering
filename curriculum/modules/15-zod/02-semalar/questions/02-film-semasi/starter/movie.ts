import { z } from 'zod'

export const movieSchema = z.object({})
export function parseMovie(raw: unknown) {
  return movieSchema.parse(raw)
}
