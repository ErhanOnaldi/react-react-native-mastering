import { describe, expect, it } from 'vitest'
import { formatRuntime } from '@exercise/formatRuntime'

describe('formatRuntime', () => {
  it('0 ve negatif dakikalarda "0 dk" döner', () => {
    expect(formatRuntime(0)).toBe('0 dk')
    expect(formatRuntime(-15)).toBe('0 dk')
  })

  it('1 saatten kısa süreleri yalnızca dakika olarak yazar (45 → "45 dk")', () => {
    expect(formatRuntime(45)).toBe('45 dk')
  })

  it('tam saatlerde dakikayı göstermez (60 → "1 sa", 120 → "2 sa")', () => {
    expect(formatRuntime(60)).toBe('1 sa')
    expect(formatRuntime(120)).toBe('2 sa')
  })

  it('saat ve dakikayı birlikte yazar (125 → "2 sa 5 dk")', () => {
    expect(formatRuntime(65)).toBe('1 sa 5 dk')
    expect(formatRuntime(125)).toBe('2 sa 5 dk')
  })
})
