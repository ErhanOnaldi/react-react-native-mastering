import type { TokenStorage } from './refreshSession'
export function createAuthClient(storage: TokenStorage) {
  return {
    async get<T>(path: string): Promise<T> {
      return {} as T
    },
  }
}
