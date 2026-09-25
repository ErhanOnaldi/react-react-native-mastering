import { describe, expect, it, vi } from 'vitest'
import { TEST_USER, requests } from '@test-utils'
import { createAuthClient } from '@exercise/authClient'
import type { Tokens, TokenStorage } from '@exercise/refreshSession'

async function login(minutes = 60): Promise<Tokens> {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...TEST_USER, expiresInMins: minutes }),
  })
  return (await response.json()) as Tokens
}
function storage(initial: Tokens): TokenStorage {
  let value = initial
  return {
    getTokens: () => value,
    setTokens: (next) => {
      value = next
    },
  }
}

describe('auth client', () => {
  it('geçerli access token ile refresh yapmadan profil alır', async () => {
    const client = createAuthClient(storage(await login()))
    expect((await client.get<{ username: string }>('/auth/me')).username).toBe('emilys')
    expect(requests('/auth/refresh')).toHaveLength(0)
  })
  it('iki paralel 401 için tek refresh yapar ve ikisini de tekrarlar', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    try {
      const store = storage(await login(1))
      vi.setSystemTime(Date.now() + 61_000)
      const client = createAuthClient(store)
      const profiles = await Promise.all([
        client.get<{ username: string }>('/auth/me'),
        client.get<{ username: string }>('/auth/me'),
      ])
      expect(profiles.map((p) => p.username)).toEqual(['emilys', 'emilys'])
      expect(requests('/auth/refresh'), 'İki 401 için tek refresh').toHaveLength(1)
      expect(requests('/auth/me')).toHaveLength(4)
    } finally {
      vi.useRealTimers()
    }
  })
  it('sonraki süre dolumunda yeni refresh başlatır', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    try {
      const client = createAuthClient(storage(await login(1)))
      vi.setSystemTime(Date.now() + 61_000)
      await client.get('/auth/me')
      vi.setSystemTime(Date.now() + 61 * 60_000)
      await client.get('/auth/me')
      expect(requests('/auth/refresh')).toHaveLength(2)
    } finally {
      vi.useRealTimers()
    }
  })
})
