export interface RequestConfig {
  method?: string
  headers?: Record<string, string>
  body?: string
  csrfToken?: string
}

export function buildCookieRequest(config: RequestConfig = {}): RequestInit {
  return {
    method: config.method ?? 'GET',
    headers: config.headers,
    body: config.body,
  }
}
