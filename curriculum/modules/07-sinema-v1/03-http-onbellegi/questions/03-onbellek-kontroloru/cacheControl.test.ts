import { describe, expect, it } from 'vitest'
import { canUseCachedResponse } from '@exercise/cacheControl'

describe('canUseCachedResponse', () => {
  it('yaşı maxAge değerinden küçükken true döner', () => {
    expect(canUseCachedResponse(30, { maxAge: 60 })).toBe(true)
  })

  it('yaş maxAge değerine eşit veya büyükse false döner', () => {
    expect(canUseCachedResponse(60, { maxAge: 60 })).toBe(false)
    expect(canUseCachedResponse(61, { maxAge: 60 })).toBe(false)
  })

  it('noCache yönergesinde yaştan bağımsız false döner', () => {
    expect(canUseCachedResponse(5, { maxAge: 100, noCache: true })).toBe(false)
  })

  it('noStore yönergesinde saklanan cevabı kullanmayı reddeder', () => {
    expect(canUseCachedResponse(5, { maxAge: 100, noStore: true })).toBe(false)
  })

  it('maxAge yoksa false döner', () => {
    expect(canUseCachedResponse(0, {})).toBe(false)
  })
})
