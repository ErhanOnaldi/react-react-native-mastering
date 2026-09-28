export class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`HTTP ${status}`)
    this.name = 'HttpError'
  }
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  void url
  void init
  return null
}
