import { tmdbHandlers } from './tmdb.ts'

/** Varsayılan sahte API'ler. Testlerde `server.use(...)` ile tek tek ezilebilir. */
export const handlers = [...tmdbHandlers]
