import { describe, expect, it, vi } from 'vitest'
import { TEST_USER, requests } from '@test-utils'
import { refreshSession } from '@exercise/refreshSession'
import type { Tokens, TokenStorage } from '@exercise/refreshSession'

async function login(): Promise<Tokens> {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER),
  })
  return (await response.json()) as Tokens
}

describe('refresh rotation', () => {
  it('tek refresh isteğiyle iki yeni token’ı birlikte saklar', async () => {
    let current = await login()
    const old = current
    const setTokens = vi.fn((tokens: Tokens) => {
      current = tokens
    })
    const storage: TokenStorage = { getTokens: () => current, setTokens }
    const fresh = await refreshSession(storage)
    expect(fresh.accessToken).not.toBe(old.accessToken)
    expect(fresh.refreshToken).not.toBe(old.refreshToken)
    expect(setTokens).toHaveBeenCalledWith(fresh)
    expect(requests('/auth/refresh')).toHaveLength(1)
  })
  it('kullanılmış refresh token’da 403 fırlatır ve storage’ı değiştirmez', async () => {
    const old = await login()
    const storage: TokenStorage = { getTokens: () => old, setTokens: vi.fn() }
    await refreshSession(storage)
    await expect(refreshSession(storage)).rejects.toThrow('403')
    expect(storage.setTokens).toHaveBeenCalledTimes(1)
  })
  it('oturum yoksa ağa gitmez', async () => {
    await expect(refreshSession({ getTokens: () => null, setTokens: vi.fn() })).rejects.toThrow()
    expect(requests('/auth/refresh')).toHaveLength(0)
  })
})
