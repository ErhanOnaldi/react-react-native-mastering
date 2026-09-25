export interface AppConfig {
  tmdbToken: string
  appTitle: string
  pageSize: number
}

/** import.meta.env gibi: her değer string ya da undefined */
export type Env = Record<string, string | undefined>

export function readConfig(env: Env): AppConfig {
  // Buraya yaz
  return { tmdbToken: '', appTitle: '', pageSize: 0 }
}
