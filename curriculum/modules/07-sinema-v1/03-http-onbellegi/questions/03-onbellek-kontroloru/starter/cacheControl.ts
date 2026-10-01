export interface CacheDirectives {
  maxAge?: number
  noCache?: boolean
  noStore?: boolean
}

export function canUseCachedResponse(ageSeconds: number, directives: CacheDirectives): boolean {
  void ageSeconds
  void directives
  return false
}
