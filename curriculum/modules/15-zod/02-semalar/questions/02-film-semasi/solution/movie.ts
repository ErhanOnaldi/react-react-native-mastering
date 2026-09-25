import { z } from 'zod'

export const movieSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, { error: 'Başlık gerekli' }),
  poster_path: z.string().nullable(),
})
export function parseMovie(raw: unknown): z.infer<typeof movieSchema> {
  return movieSchema.parse(raw)
}
