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
  if (!header || !header.trim()) {
    return {}
  }

  const result: CacheDirectives = {}
  const parts = header.split(',').map((p) => p.trim().toLowerCase())

  for (const part of parts) {
    if (part.startsWith('max-age=')) {
      const val = Number.parseInt(part.slice('max-age='.length), 10)
      if (!Number.isNaN(val)) result.maxAge = val
    } else if (part.startsWith('s-maxage=')) {
      const val = Number.parseInt(part.slice('s-maxage='.length), 10)
      if (!Number.isNaN(val)) result.sMaxAge = val
    } else if (part === 'no-cache') {
      result.noCache = true
    } else if (part === 'no-store') {
      result.noStore = true
    } else if (part === 'must-revalidate') {
      result.mustRevalidate = true
    } else if (part === 'immutable') {
      result.immutable = true
    } else if (part === 'public') {
      result.isPublic = true
    } else if (part === 'private') {
      result.isPrivate = true
    }
  }

  return result
}

export function isFresh(
  ageSeconds: number,
  directives: CacheDirectives,
): boolean {
  if (directives.noStore || directives.noCache) {
    return false
  }

  if (directives.maxAge !== undefined) {
    return ageSeconds < directives.maxAge
  }

  return false
}
