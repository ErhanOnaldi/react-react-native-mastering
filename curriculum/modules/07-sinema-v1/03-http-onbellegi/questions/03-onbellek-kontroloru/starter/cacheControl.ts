export interface CacheDirectives {
  maxAge?: number
  sMaxAge?: number
  noCache?: boolean
  noStore?: boolean
  mustRevalidate?: boolean
  immutable?: boolean
  isPublic?: boolean
  isPrivate?: boolean
}

export function parseCacheControl(
  header: string | null | undefined,
): CacheDirectives {
  void header
  return {}
}

export function isFresh(
  ageSeconds: number,
  directives: CacheDirectives,
): boolean {
  void ageSeconds
  void directives
  return false
}
