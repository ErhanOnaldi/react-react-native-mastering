export interface RequestConfig {
  method?: string
  headers?: Record<string, string>
  body?: string
  csrfToken?: string
}

export function buildCookieRequest(config: RequestConfig = {}): RequestInit {
  const method = (config.method ?? 'GET').toUpperCase()
  const headers: Record<string, string> = { ...config.headers }

  const stateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)
  if (stateChanging && config.csrfToken) {
    headers['X-CSRF-TOKEN'] = config.csrfToken
  }

  if (config.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  return {
    method,
    headers,
    credentials: 'include',
    body: config.body,
  }
}
