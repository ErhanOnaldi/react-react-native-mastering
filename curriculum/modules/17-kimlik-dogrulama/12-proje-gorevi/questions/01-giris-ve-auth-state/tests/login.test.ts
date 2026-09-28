import { describe, expect, it } from 'vitest'
import { TEST_USER, requests } from '@test-utils'
import { login } from '@project/src/features/auth/auth-api'
import { authSlice, setCredentials, clearAuth } from '@project/src/features/auth/authSlice'

describe('Sinema giriş sözleşmesi', () => {
  it('DummyJSON hesabıyla iki token ve kullanıcı alır', async () => {
    const result = await login(TEST_USER.username, TEST_USER.password)
    expect(result.username).toBe('emilys')
    expect(result.id).toBeGreaterThan(0)
    expect(result.accessToken.split('.')).toHaveLength(3)
    expect(result.refreshToken.split('.')).toHaveLength(3)
    expect(requests('/auth/login')).toHaveLength(1)
  })
  it('yanlış parolada API hatasını fırlatır', async () => {
    await expect(login(TEST_USER.username, 'yanlis')).rejects.toThrow('Invalid credentials')
  })
  it('authSlice girişte kimliği tutar, çıkışta tamamını temizler', () => {
    const initial = authSlice.reducer(undefined, { type: 'init' })
    const filled = authSlice.reducer(
      initial,
      setCredentials({ user: { id: 1, username: 'emilys' }, accessToken: 'a', refreshToken: 'r' }),
    )
    expect(filled.user?.username).toBe('emilys')
    expect(filled.accessToken).toBe('a')
    expect(authSlice.reducer(filled, clearAuth())).toMatchObject({
      user: null,
      accessToken: null,
      refreshToken: null,
    })
  })
})
