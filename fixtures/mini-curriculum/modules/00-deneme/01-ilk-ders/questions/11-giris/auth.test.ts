import { afterEach, describe, expect, it, vi } from 'vitest'
import { TEST_USER } from '@test-utils'
import { getMe, login } from '@exercise/auth'

describe('DummyJSON auth', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('doğru bilgilerle JWT biçiminde token alır ve profili getirir', async () => {
    const token = await login(TEST_USER.username, TEST_USER.password)
    expect(token.split('.')).toHaveLength(3)
    expect(await getMe(token)).toMatchObject({ username: 'emilys' })
  })

  it('yanlış şifrede hata fırlatır', async () => {
    await expect(login('emilys', 'yanlis')).rejects.toThrow()
  })

  it('süresi dolan token ile null döner', async () => {
    const token = await login(TEST_USER.username, TEST_USER.password)
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(Date.now() + 2 * 60_000)
    expect(await getMe(token)).toBeNull()
  })
})
