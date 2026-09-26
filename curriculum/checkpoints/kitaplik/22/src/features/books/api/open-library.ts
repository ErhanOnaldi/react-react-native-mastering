import type { z } from 'zod'

export const OPEN_LIBRARY_BASE = 'https://openlibrary.org'

/** Open Library'den gelen başarısız cevap. `status` ile 404'ü diğer hatalardan ayırırız. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

type Params = Record<string, string | number>

/**
 * Open Library'ye GET isteği atar ve cevabı verilen Zod şemasıyla doğrular.
 * Anahtar gerekmez; ağ hatası, HTTP hatası ve beklenmedik veri tek yerde ele alınır.
 */
export async function openLibraryGet<S extends z.ZodType>(
  path: string,
  schema: S,
  { params, signal }: { params?: Params; signal?: AbortSignal } = {},
): Promise<z.output<S>> {
  const url = new URL(path, OPEN_LIBRARY_BASE)
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, String(value))
  }
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new ApiError(response.status, `Open Library ${response.status} döndü: ${url.pathname}`)
  }
  const parsed = schema.safeParse(await response.json())
  if (!parsed.success) {
    throw new ApiError(response.status, `Beklenmeyen Open Library cevabı: ${url.pathname}`)
  }
  return parsed.data
}
