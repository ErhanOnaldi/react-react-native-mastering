import { describe, expect, it } from 'vitest'
import { formatRuntime } from '@impl/formatRuntime'

describe('formatRuntime', () => {
  it('saat ve dakikayı formatlar', () => {
    expect(formatRuntime(139)).toBe('2 sa 19 dk')
  })

  it('60 dakikadan az sürede yalnızca dakikayı gösterir', () => {
    expect(formatRuntime(45)).toBe('45 dk')
  })

  it('tam saatlerde kalan dakika sıfırsa yalnızca saati gösterir', () => {
    expect(formatRuntime(120)).toBe('2 sa')
  })

  it('null, 0 veya negatif sürede açıklayıcı metin döner', () => {
    expect(formatRuntime(null)).toBe('Süre bilinmiyor')
    expect(formatRuntime(0)).toBe('Süre bilinmiyor')
    expect(formatRuntime(-10)).toBe('Süre bilinmiyor')
  })
})
