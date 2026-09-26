import { store, resetUserState } from '@/app/store'
import { queryClient } from '@/shared/api/query-client'
import { logout } from './logout'
import { setCredentials } from './authSlice'

const BASE_URL = 'https://dummyjson.com'

interface Tokens {
  accessToken: string
  refreshToken: string
}

interface TokenStorage {
  getTokens(): Tokens | null
  setTokens(tokens: Tokens): void
}

export function createAuthClient(
  storage: TokenStorage,
  onUnauthorized?: () => void,
) {
  let refreshPromise: Promise<Tokens> | null = null

  async function refresh(): Promise<Tokens> {
    const tokens = storage.getTokens()
    if (!tokens?.refreshToken) throw new Error('Oturum sona erdi.')
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    })
    if (!response.ok) throw new Error('Oturum yenilenemedi.')
    const next = (await response.json()) as Tokens
    storage.setTokens(next)
    return next
  }

  async function request(path: string, token: string): Promise<Response> {
    return fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  return {
    async get<T>(path: string): Promise<T> {
      const usedToken = storage.getTokens()?.accessToken
      if (!usedToken) throw new Error('Giriş yapmalısın.')
      let response = await request(path, usedToken)
      if (response.status === 401) {
        // A request that reached 401 while another request refreshed can use
        // the newer access token without rotating the refresh token again.
        const current = storage.getTokens()?.accessToken
        if (current && current !== usedToken) {
          response = await request(path, current)
        } else {
          if (!refreshPromise)
            refreshPromise = refresh().finally(() => {
              refreshPromise = null
            })
          try {
            const tokens = await refreshPromise
            response = await request(path, tokens.accessToken)
          } catch (error) {
            onUnauthorized?.()
            throw error
          }
        }
      }
      if (response.status === 403) onUnauthorized?.()
      if (!response.ok) throw new Error(`İstek başarısız (${response.status}).`)
      return response.json() as Promise<T>
    },
  }
}

export const authClient = createAuthClient(
  {
    getTokens: () => {
      const { accessToken, refreshToken } = store.getState().auth
      return accessToken && refreshToken ? { accessToken, refreshToken } : null
    },
    setTokens: (tokens) => {
      const user = store.getState().auth.user
      if (user) store.dispatch(setCredentials({ user, ...tokens }))
    },
  },
  () =>
    logout({ queryClient, storage: localStorage, resetStore: resetUserState }),
)
