import { describe, expect, expectTypeOf, it } from 'vitest'
import { formatDate, formatVote, releaseYear } from '@project/src/lib/format'

describe('Sinema format yardımcıları', () => {
  it('oylanmamış filmi açık metinle gösterir', () => {
    expect(formatVote(0)).toBe('Henüz oy yok')
  })

  it('puanı bir ondalığa yuvarlar ve sondaki sıfırı korur', () => {
    expect(formatVote(7.456)).toBe('7.5')
    expect(formatVote(8)).toBe('8.0')
  })

  it('dolu tarihten yalnızca yılı çıkarır', () => {
    expect(releaseYear('1999-10-15')).toBe('1999')
  })

  it('boş tarihi yıl olarak boş bırakır', () => {
    expect(releaseYear('')).toBe('')
  })

  it('Türkçe uzun tarihi gün kaymadan gösterir', () => {
    expect(formatDate('1999-10-15')).toBe('15 Ekim 1999')
    expect(formatDate('2026-07-15')).toBe('15 Temmuz 2026')
  })

  it('boş tarihi kullanıcıya açıklayan metne çevirir', () => {
    expect(formatDate('')).toBe('Tarih yok')
  })

  it('fonksiyonlar sayı veya tarih metni alıp metin döndürür', () => {
    expectTypeOf(formatVote).toEqualTypeOf<(n: number) => string>()
    expectTypeOf(releaseYear).toEqualTypeOf<(date: string) => string>()
    expectTypeOf(formatDate).toEqualTypeOf<(date: string) => string>()
  })
})
