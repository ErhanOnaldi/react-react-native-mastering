import { refreshSession } from './refreshSession'
import type { Tokens, TokenStorage } from './refreshSession'

export function createAuthClient(storage: TokenStorage) {
  let inFlight: Promise<Tokens> | null = null
  async function request<T>(path: string, accessToken?: string): Promise<Response> {
    return fetch(`https://dummyjson.com${path}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
  }
  return {
    async get<T>(path: string): Promise<T> {
      const used = storage.getTokens()?.accessToken
      let response = await request<T>(path, used)
      if (response.status === 401) {
        let current = storage.getTokens()?.accessToken
        if (!current || current === used) {
          if (!inFlight) {
            inFlight = refreshSession(storage).finally(() => {
              inFlight = null
            })
          }
          current = (await inFlight).accessToken
        }
        response = await request<T>(path, current)
      }
      if (!response.ok) throw new Error(`İstek başarısız: ${response.status}`)
      return (await response.json()) as T
    },
  }
}
