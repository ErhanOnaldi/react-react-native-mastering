import { z } from 'zod'
export function readConfig(env: Record<string, string | undefined>): {
  tmdbToken: string
  appTitle: string
  pageSize: number
} {
  return {
    tmdbToken: env.VITE_TMDB_TOKEN ?? '',
    appTitle: env.VITE_APP_TITLE ?? 'Sinema',
    pageSize: 20,
  }
}
