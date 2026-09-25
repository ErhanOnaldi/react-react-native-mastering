import { dummyJsonHandlers } from './dummyjson.ts'
import { openLibraryHandlers } from './openlibrary.ts'
import { tmdbHandlers } from './tmdb.ts'

/** Varsayılan sahte API'ler. Testlerde `server.use(...)` ile tek tek ezilebilir. */
export const handlers = [...tmdbHandlers, ...dummyJsonHandlers, ...openLibraryHandlers]
