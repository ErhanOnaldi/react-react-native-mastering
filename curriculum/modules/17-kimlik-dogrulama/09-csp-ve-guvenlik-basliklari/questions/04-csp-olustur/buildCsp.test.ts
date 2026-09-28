import { describe, expect, it } from 'vitest'
import { buildCsp } from '@exercise/buildCsp'

describe('buildCsp', () => {
  it('tek bir yönergeyi doğru biçimlendirir', () => {
    expect(buildCsp({ 'default-src': ["'self'"] })).toBe("default-src 'self'")
  })

  it('birden fazla yönergeyi noktalı virgül ve boşluk ile birleştirir', () => {
    const result = buildCsp({
      'default-src': ["'self'"],
      'img-src': ["'self'", 'https://image.tmdb.org', 'data:'],
      'connect-src': ["'self'", 'https://api.themoviedb.org'],
    })
    expect(result).toBe(
      "default-src 'self'; img-src 'self' https://image.tmdb.org data:; connect-src 'self' https://api.themoviedb.org",
    )
  })

  it('boş veya undefined kaynak dizilerini atlar', () => {
    const result = buildCsp({
      'default-src': ["'self'"],
      'font-src': [],
      'frame-src': undefined,
      'object-src': ["'none'"],
    })
    expect(result).toBe("default-src 'self'; object-src 'none'")
  })

  it('kaynak dizelerindeki gereksiz boşlukları temizler', () => {
    const result = buildCsp({
      'script-src': ["  'self'  ", '  https://apis.example.com '],
    })
    expect(result).toBe("script-src 'self' https://apis.example.com")
  })

  it('boş nesne verildiğinde boş dize döndürür', () => {
    expect(buildCsp({})).toBe('')
  })
})
