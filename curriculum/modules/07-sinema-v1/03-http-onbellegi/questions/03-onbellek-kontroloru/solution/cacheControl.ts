export interface CacheDirectives {
  maxAge?: number
  noCache?: boolean
  noStore?: boolean
}

export function canUseCachedResponse(ageSeconds: number, directives: CacheDirectives): boolean {
  if (directives.noStore || directives.noCache) {
    return false
  }

  if (directives.maxAge !== undefined) {
    return ageSeconds < directives.maxAge
  }

  return false
}
