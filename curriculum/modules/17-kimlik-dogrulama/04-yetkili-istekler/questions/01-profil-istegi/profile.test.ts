import { describe, expect, it, vi } from 'vitest'
import { TEST_USER, requests } from '@test-utils'
import { getProfile } from '@exercise/profile'

async function token(minutes = 60) {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...TEST_USER, expiresInMins: minutes }),
  })
  return ((await response.json()) as { accessToken: string }).accessToken
}

describe('yetkili profil isteği', () => {
  it('Bearer access token ile gerçek profili okur', async () => {
    const profile = await getProfile(await token())
    expect(profile.username).toBe('emilys')
    expect(profile.id).toBeGreaterThan(0)
    expect(requests('/auth/me')).toHaveLength(1)
  })
  it('başlıksız veya boş token’da 401 hatasını görünür kılar', async () => {
    await expect(getProfile('')).rejects.toThrow('401')
  })
  it('süresi dolan token’da eski profili döndürmez', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    try {
      const accessToken = await token(1)
      vi.setSystemTime(Date.now() + 61_000)
      await expect(getProfile(accessToken)).rejects.toThrow('401')
    } finally {
      vi.useRealTimers()
    }
  })
})
