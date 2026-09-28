import { describe, expect, it } from 'vitest'
import { isFresh, parseCacheControl } from '@exercise/cacheControl'

describe('parseCacheControl', () => {
  it('boş veya geçersiz başlıklarda boş nesne döner', () => {
    expect(parseCacheControl(null)).toEqual({})
    expect(parseCacheControl(undefined)).toEqual({})
    expect(parseCacheControl('')).toEqual({})
    expect(parseCacheControl('   ')).toEqual({})
  })

  it('max-age ve s-maxage yönergelerini sayı olarak ayrıştırır', () => {
    const result = parseCacheControl('max-age=3600, s-maxage=7200')
    expect(result.maxAge).toBe(3600)
    expect(result.sMaxAge).toBe(7200)
  })

  it('boolean yönergeleri ve büyük/küçük harf durumlarını doğru tanır', () => {
    const result = parseCacheControl(
      'PUBLIC, NO-CACHE, MUST-REVALIDATE, IMMUTABLE',
    )
    expect(result.isPublic).toBe(true)
    expect(result.noCache).toBe(true)
    expect(result.mustRevalidate).toBe(true)
    expect(result.immutable).toBe(true)
  })

  it('private ve no-store yönergelerini ayrıştırır', () => {
    const result = parseCacheControl('private, no-store')
    expect(result.isPrivate).toBe(true)
    expect(result.noStore).toBe(true)
  })
})

describe('isFresh', () => {
  it('maxAge süresi henüz dolmamış yanıtları taze kabul eder', () => {
    expect(isFresh(30, { maxAge: 60 })).toBe(true)
    expect(isFresh(0, { maxAge: 10 })).toBe(true)
  })

  it('maxAge süresine eşit veya aşmış yanıtları bayat kabul eder', () => {
    expect(isFresh(60, { maxAge: 60 })).toBe(false)
    expect(isFresh(61, { maxAge: 60 })).toBe(false)
  })

  it('noCache veya noStore bayrağı varsa süreye bakılmaksızın bayat kabul eder', () => {
    expect(isFresh(5, { maxAge: 100, noCache: true })).toBe(false)
    expect(isFresh(5, { maxAge: 100, noStore: true })).toBe(false)
  })

  it('maxAge bilgisi bulunmayan yanıtları taze kabul etmez', () => {
    expect(isFresh(10, { isPublic: true })).toBe(false)
    expect(isFresh(0, {})).toBe(false)
  })
})
