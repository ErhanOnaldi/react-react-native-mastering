export interface AppConfig {
  tmdbToken: string
  appTitle: string
  pageSize: number
}

/** import.meta.env gibi: her değer string ya da undefined */
export type Env = Record<string, string | undefined>

const DEFAULT_TITLE = 'Sinema'
const DEFAULT_PAGE_SIZE = 20

export function readConfig(env: Env): AppConfig {
  const tmdbToken = env.VITE_TMDB_TOKEN?.trim()
  if (!tmdbToken) {
    throw new Error('VITE_TMDB_TOKEN tanımlı değil. Kök dizindeki .env dosyasına ekle.')
  }

  const appTitle = env.VITE_APP_TITLE?.trim() || DEFAULT_TITLE

  const size = Number(env.VITE_PAGE_SIZE)
  const pageSize = Number.isInteger(size) && size > 0 ? size : DEFAULT_PAGE_SIZE

  return { tmdbToken, appTitle, pageSize }
}
