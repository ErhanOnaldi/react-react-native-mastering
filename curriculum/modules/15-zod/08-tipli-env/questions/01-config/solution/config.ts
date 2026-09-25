import { z } from 'zod'
const pageSize = z.coerce.number().int().positive()
const envSchema = z
  .object({
    VITE_TMDB_TOKEN: z
      .string({ error: 'VITE_TMDB_TOKEN gerekli' })
      .trim()
      .min(1, { error: 'VITE_TMDB_TOKEN gerekli' }),
    VITE_APP_TITLE: z.string().optional(),
    VITE_PAGE_SIZE: z.string().optional(),
  })
  .transform((raw) => {
    const parsedSize = pageSize.safeParse(raw.VITE_PAGE_SIZE)
    return {
      tmdbToken: raw.VITE_TMDB_TOKEN,
      appTitle: raw.VITE_APP_TITLE?.trim() || 'Sinema',
      pageSize: parsedSize.success ? parsedSize.data : 20,
    }
  })
export function readConfig(env: Record<string, string | undefined>): z.output<typeof envSchema> {
  return envSchema.parse(env)
}
