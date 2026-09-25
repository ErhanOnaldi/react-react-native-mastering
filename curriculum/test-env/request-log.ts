// Testlerde "kaç istek atıldı?" sorusunu yanıtlamak için MSW olaylarından tutulan kayıt.
export interface LoggedRequest {
  method: string
  url: string
  /** `/3/movie/550` gibi yol (query string hariç) */
  path: string
  search: URLSearchParams
}

const log: LoggedRequest[] = []

export function recordRequest(request: Request) {
  const url = new URL(request.url)
  log.push({ method: request.method, url: request.url, path: url.pathname, search: url.searchParams })
}

/**
 * Atılan istekleri döner. Filtre verilirse yolu (pathname) eşleşenler:
 * `requests('/3/movie/550')` · `requests(/\/search\/movie/)`
 */
export function requests(filter?: string | RegExp): LoggedRequest[] {
  if (filter === undefined) return [...log]
  return log.filter((r) => (typeof filter === 'string' ? r.path === filter : filter.test(r.url)))
}

export function clearRequests() {
  log.length = 0
}
