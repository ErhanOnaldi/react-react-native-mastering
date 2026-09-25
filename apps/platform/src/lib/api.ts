// Sunucuyla konuşan tek yer: tipli, hataları ApiError olarak fırlatan küçük bir fetch sarmalayıcısı.
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api${url}`, {
    method,
    // x-rm-client: sunucunun CSRF koruması (başka siteler bu başlığı gönderemez)
    headers: {
      'x-rm-client': '1',
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string }
    throw new ApiError(response.status, data.error ?? `İstek başarısız (${response.status})`)
  }
  return (await response.json()) as T
}

export const api = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, body?: unknown) => request<T>('POST', url, body),
  put: <T>(url: string, body?: unknown) => request<T>('PUT', url, body),
}
