import { z } from 'zod'
const envSchema = z.object({
  VITE_TMDB_TOKEN: z
    .string({ error: 'VITE_TMDB_TOKEN gerekli' })
    .trim()
    .min(1, { error: 'VITE_TMDB_TOKEN gerekli' }),
  VITE_APP_TITLE: z.string().optional(),
  VITE_PAGE_SIZE: z.string().optional(),
})
const pageSizeSchema = z.coerce.number().int().positive()

export function readConfig(env: Record<string, string | undefined>) {
  const parsed = envSchema.parse(env)
  const pageSize = pageSizeSchema.safeParse(parsed.VITE_PAGE_SIZE)
  return {
    tmdbToken: parsed.VITE_TMDB_TOKEN,
    appTitle: parsed.VITE_APP_TITLE?.trim() || 'Sinema',
    pageSize: pageSize.success ? pageSize.data : 20,
  }
}
