import { describe, expect, it } from 'vitest'
import { DUMMYJSON_BASE, TEST_USER, requests } from '@test-utils'
import { decodeJwtPayload, login } from '@exercise/login'

describe('giriş ve JWT', () => {
  it('doğru bilgilerle iki token alır ve bir login isteği atar', async () => {
    const tokens = await login(TEST_USER.username, TEST_USER.password)
    expect(tokens.accessToken.split('.')).toHaveLength(3)
    expect(tokens.refreshToken.split('.')).toHaveLength(3)
    expect(requests('/auth/login')).toHaveLength(1)
    expect(requests('/auth/login')[0].url).toBe(`${DUMMYJSON_BASE}/auth/login`)
  })
  it('yanlış parolada sunucunun hatasını gösterir', async () => {
    await expect(login(TEST_USER.username, 'yanlis')).rejects.toThrow('Invalid credentials')
  })
  it('gerçek token payload’ından kullanıcıyı ve exp değerini okur', async () => {
    const { accessToken } = await login(TEST_USER.username, TEST_USER.password)
    const payload = decodeJwtPayload(accessToken)
    expect(payload?.username).toBe(TEST_USER.username)
    expect(payload?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000))
  })
  it('bozuk ve eksik payload’da null döner', () => {
    expect(decodeJwtPayload('bozuk-token')).toBeNull()
    expect(decodeJwtPayload('a.e30.b')).toBeNull()
  })
})
