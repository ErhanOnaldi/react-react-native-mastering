import { describe, expect, it } from 'vitest'
import { getSafeRedirect } from '@project/src/features/auth/safe-redirect'

describe('getSafeRedirect', () => {
  it('uygulama içi geçerli mutlak yolu korur', () => {
    expect(getSafeRedirect('/watchlists')).toBe('/watchlists')
    expect(getSafeRedirect('/')).toBe('/')
    expect(getSafeRedirect('/profile')).toBe('/profile')
  })

  it('query ve hash parametrelerini içeren uygulama içi yolu korur', () => {
    expect(getSafeRedirect('/watchlists?sort=new#mine')).toBe('/watchlists?sort=new#mine')
    expect(getSafeRedirect('/movie/550?tab=cast')).toBe('/movie/550?tab=cast')
  })

  it('protokol belirten harici adresleri fallback değerine çevirir', () => {
    expect(getSafeRedirect('https://evil.example')).toBe('/profile')
    expect(getSafeRedirect('http://evil.example/login', '/login')).toBe('/login')
    expect(getSafeRedirect('javascript:alert(1)')).toBe('/profile')
  })

  it('protokolü devralan // ile başlayan harici adresleri fallback değerine çevirir', () => {
    expect(getSafeRedirect('//evil.example')).toBe('/profile')
    expect(getSafeRedirect('//evil.example/phish', '/')).toBe('/')
  })

  it('ters eğik çizgi ve kontrol karakteri içeren adresleri fallback değerine çevirir', () => {
    expect(getSafeRedirect('/\\evil.example')).toBe('/profile')
    expect(getSafeRedirect('/path\n/sub')).toBe('/profile')
    expect(getSafeRedirect('/path\r/sub')).toBe('/profile')
  })

  it('göreli yolları ve metin olmayan geçersiz değerleri fallback değerine çevirir', () => {
    expect(getSafeRedirect('watchlists')).toBe('/profile')
    expect(getSafeRedirect('')).toBe('/profile')
    expect(getSafeRedirect(null)).toBe('/profile')
    expect(getSafeRedirect(undefined)).toBe('/profile')
    expect(getSafeRedirect(123)).toBe('/profile')
    expect(getSafeRedirect({}, '/custom')).toBe('/custom')
  })
})
