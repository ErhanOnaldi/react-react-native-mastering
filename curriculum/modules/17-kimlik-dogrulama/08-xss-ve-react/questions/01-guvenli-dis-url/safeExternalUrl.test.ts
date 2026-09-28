import { describe, expect, it } from 'vitest'
import { safeExternalUrl } from '@exercise/safeExternalUrl'

describe('safeExternalUrl', () => {
  it('https ve http protokolüne sahip geçerli adresleri korur', () => {
    expect(safeExternalUrl('https://themoviedb.org')).toBe('https://themoviedb.org')
    expect(safeExternalUrl('http://example.com/api')).toBe('http://example.com/api')
  })

  it('mailto protokolünü geçerli kabul eder', () => {
    expect(safeExternalUrl('mailto:destek@sinema.example')).toBe('mailto:destek@sinema.example')
  })

  it('javascript ve tehlikeli betik şemalarını fallback değerine çevirir', () => {
    expect(safeExternalUrl('javascript:alert(1)')).toBe('#')
    expect(safeExternalUrl('JAVASCRIPT:alert(1)')).toBe('#')
    expect(safeExternalUrl('javascript:/*comment*/alert(1)')).toBe('#')
  })

  it('data ve vbscript şemalarını fallback değerine çevirir', () => {
    expect(safeExternalUrl('data:text/html,<script>alert(1)</script>')).toBe('#')
    expect(safeExternalUrl('vbscript:msgbox("xss")')).toBe('#')
  })

  it('şemasız göreli yolları ve bozuk URL dizilerini fallback değerine çevirir', () => {
    expect(safeExternalUrl('/profile')).toBe('#')
    expect(safeExternalUrl('about-us')).toBe('#')
    expect(safeExternalUrl('ht tp://invalid')).toBe('#')
  })

  it('string olmayan ve boş değerleri fallback değerine çevirir', () => {
    expect(safeExternalUrl('')).toBe('#')
    expect(safeExternalUrl('   ')).toBe('#')
    expect(safeExternalUrl(null)).toBe('#')
    expect(safeExternalUrl(undefined)).toBe('#')
    expect(safeExternalUrl(12345)).toBe('#')
  })

  it('özel fallback parametresini uygular', () => {
    expect(safeExternalUrl('javascript:evil()', '/fallback')).toBe('/fallback')
    expect(safeExternalUrl(null, '/404')).toBe('/404')
  })
})
