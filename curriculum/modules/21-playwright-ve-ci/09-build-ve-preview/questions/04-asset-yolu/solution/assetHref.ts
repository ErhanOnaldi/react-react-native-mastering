export function assetHref(basePath: string, assetPath: string): string {
  const base = basePath.split('/').filter(Boolean).join('/')
  const asset = assetPath.replace(/^\/+/, '')
  return `/${base ? `${base}/` : ''}${asset}`
}
