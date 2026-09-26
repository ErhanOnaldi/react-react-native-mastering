/** URL → arama durumu. URL tek doğruluk kaynağı; bozuk `page` değerleri 1'e düşer. */
export function readSearchParams(searchParams: URLSearchParams) {
  const q = searchParams.get('q')?.trim() ?? ''
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10)
  return { q, page: Number.isInteger(page) && page > 0 ? page : 1 }
}

/** Arama durumu → URL. 1. sayfa URL'ye yazılmaz: `/search?q=dune` ile `/search?q=dune&page=1` aynı sayfa. */
export function searchHref({ q, page = 1 }: { q: string; page?: number }) {
  const params = new URLSearchParams({ q })
  if (page > 1) params.set('page', String(page))
  return `/search?${params.toString()}`
}

export function totalPages(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize))
}
