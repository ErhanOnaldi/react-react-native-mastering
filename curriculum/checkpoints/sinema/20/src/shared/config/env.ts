import { z } from 'zod'

const envSchema = z.object({
  VITE_TMDB_TOKEN: z
    .string({ error: 'VITE_TMDB_TOKEN gerekli' })
    .trim()
    .min(1, 'VITE_TMDB_TOKEN gerekli'),
  VITE_APP_TITLE: z
    .string()
    .trim()
    .optional()
    .transform((title) => title || 'Sinema'),
})
const values = envSchema.parse(import.meta.env)
export const env = {
  tmdbToken: values.VITE_TMDB_TOKEN,
  appTitle: values.VITE_APP_TITLE,
}
