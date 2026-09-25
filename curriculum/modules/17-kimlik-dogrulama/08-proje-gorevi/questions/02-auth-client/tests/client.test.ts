import { describe, expect, it, vi } from 'vitest'
import { TEST_USER, requests } from '@test-utils'
import { createAuthClient } from '@project/src/features/auth/authClient'

interface Tokens {
  accessToken: string
  refreshToken: string
}
async function login(minutes = 60): Promise<Tokens> {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...TEST_USER, expiresInMins: minutes }),
  })
  return (await response.json()) as Tokens
}
describe('Sinema authClient', () => {
  it('iki paralel süresi dolmuş istek için tek refresh ve iki retry yapar', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    try {
      let tokens = await login(1)
      const oldRefresh = tokens.refreshToken
      vi.setSystemTime(Date.now() + 61_000)
      const client = createAuthClient({
        getTokens: () => tokens,
        setTokens: (next: Tokens) => {
          tokens = next
        },
      })
      const profiles = await Promise.all([
        client.get<{ username: string }>('/auth/me'),
        client.get<{ username: string }>('/auth/me'),
      ])
      expect(profiles.map((profile) => profile.username)).toEqual(['emilys', 'emilys'])
      expect(requests('/auth/refresh')).toHaveLength(1)
      expect(requests('/auth/me')).toHaveLength(4)
      expect(tokens.refreshToken).not.toBe(oldRefresh)
    } finally {
      vi.useRealTimers()
    }
  })
  it('geçerli token için refresh yapmaz', async () => {
    let tokens = await login()
    const client = createAuthClient({
      getTokens: () => tokens,
      setTokens: (next: Tokens) => {
        tokens = next
      },
    })
    expect((await client.get<{ username: string }>('/auth/me')).username).toBe('emilys')
    expect(requests('/auth/refresh')).toHaveLength(0)
  })
})
