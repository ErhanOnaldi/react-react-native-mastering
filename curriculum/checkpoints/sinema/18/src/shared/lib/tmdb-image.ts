export type ImageSize = 'w185' | 'w342' | 'w500' | 'original'

export function posterUrl(
  path: string | null,
  size: ImageSize = 'w342',
): string | undefined {
  if (path === null) return undefined
  return `https://image.tmdb.org/t/p/${size}/${path.replace(/^\/+/, '')}`
}
