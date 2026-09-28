export interface RequestOptions {
  method?: string
  headers?: Record<string, string>
}

const SIMPLE_METHODS = new Set(['GET', 'HEAD', 'POST'])
const SAFELISTED_HEADERS = new Set([
  'accept',
  'accept-language',
  'content-language',
  'content-type',
])
const SAFELISTED_CONTENT_TYPES = new Set([
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'text/plain',
])

export function needsPreflight(options?: RequestOptions): boolean {
  const method = (options?.method ?? 'GET').toUpperCase()
  if (!SIMPLE_METHODS.has(method)) {
    return true
  }

  const headers = options?.headers ?? {}
  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase()
    if (!SAFELISTED_HEADERS.has(lowerKey)) {
      return true
    }

    if (lowerKey === 'content-type') {
      const mimeType = value.split(';')[0]!.trim().toLowerCase()
      if (!SAFELISTED_CONTENT_TYPES.has(mimeType)) {
        return true
      }
    }
  }

  return false
}
