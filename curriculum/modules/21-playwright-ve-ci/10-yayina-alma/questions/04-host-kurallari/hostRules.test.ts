import { describe, expect, it } from 'vitest'
import { makeHostRules } from '@exercise/hostRules'

describe('makeHostRules', () => {
  it('derin uygulama yollarını index belgesine başarılı yanıtla yönlendirir', () => {
    expect(makeHostRules([]).redirects).toMatch(/^\/\*\s+\/index\.html\s+200/m)
  })
  it('hashli assetleri uzun süre saklar ve HTML belgesini yeniden doğrular', () => {
    const { headers } = makeHostRules([])
    expect(headers).toMatch(
      /\/assets\/\*[\s\S]*?Cache-Control:\s*public,\s*max-age=31536000,\s*immutable/,
    )
    expect(headers).toMatch(/\/index\.html[\s\S]*?Cache-Control:\s*no-cache/)
  })
  it('verilen API originlerini bağlantı iznine ekler', () => {
    const { headers } = makeHostRules([
      'https://api.etkinlik.example',
      'https://auth.etkinlik.example',
    ])
    expect(headers).toMatch(/Content-Security-Policy:/)
    expect(headers).toMatch(/connect-src[^;\n]*'self'[^;\n]*https:\/\/api\.etkinlik\.example/)
    expect(headers).toMatch(/connect-src[^;\n]*https:\/\/auth\.etkinlik\.example/)
  })
})
