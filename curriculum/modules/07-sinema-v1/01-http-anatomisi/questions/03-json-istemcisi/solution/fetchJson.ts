export class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`HTTP ${status}`)
    this.name = 'HttpError'
  }
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  const response = await fetch(url, init)
  if (!response.ok) throw new HttpError(response.status)
  if (response.status === 204) return null
  return (await response.json()) as T
}
