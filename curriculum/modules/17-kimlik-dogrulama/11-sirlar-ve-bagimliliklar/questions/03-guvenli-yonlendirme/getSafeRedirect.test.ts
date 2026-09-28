import { describe, expect, it } from 'vitest'
import { getSafeRedirect } from '@exercise/getSafeRedirect'

describe('Güvenli dönüş adresi', () => {
  it('uygulama içi yolu query ve hash ile korur', () => {
    expect(getSafeRedirect('/watchlists?sort=new#mine')).toBe('/watchlists?sort=new#mine')
    expect(getSafeRedirect('/')).toBe('/')
  })
  it('dış ve göreli adresleri fallback değerine çevirir', () => {
    expect(getSafeRedirect('//evil.example')).toBe('/profile')
    expect(getSafeRedirect('https://evil.example', '/login')).toBe('/login')
    expect(getSafeRedirect('watchlists')).toBe('/profile')
    expect(getSafeRedirect(null)).toBe('/profile')
  })
  it('ters eğik çizgi ve kontrol karakterlerini reddeder', () => {
    expect(getSafeRedirect('/\\evil.example')).toBe('/profile')
    expect(getSafeRedirect('/ok\nno')).toBe('/profile')
  })
})
