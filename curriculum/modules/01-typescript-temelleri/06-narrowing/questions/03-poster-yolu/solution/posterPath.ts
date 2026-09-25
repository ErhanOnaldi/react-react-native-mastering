export function posterPath(path: string | null): string | null {
  if (path === null || path === '') return null
  return path.startsWith('/') ? path : `/${path}`
}
