export type CoverSize = 'S' | 'M' | 'L'

/** Kapak id'si yoksa (ya da Open Library'nin "kapak yok" işareti -1 ise) `null` döner. */
export function coverUrl(coverId: number | null, size: CoverSize = 'M'): string | null {
  if (coverId === null || coverId <= 0) return null
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
}
