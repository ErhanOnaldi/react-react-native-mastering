import { describe, expect, it } from 'vitest'
import { parseMovieId } from '@exercise/parseMovieId'

describe('film id dönüşümü', () => {
  it('550 metnini 550 sayısına çevirir', () => expect(parseMovieId('550')).toBe(550))
  it('eksik veya boş parametreyi reddeder', () => {
    expect(parseMovieId(undefined)).toBeNull()
    expect(parseMovieId('')).toBeNull()
  })
  it('harfli ve sıfır id değerlerini reddeder', () => {
    expect(parseMovieId('abc')).toBeNull()
    expect(parseMovieId('0')).toBeNull()
    expect(parseMovieId('5x')).toBeNull()
  })
  it('güvenli sayı aralığı dışındaki id değerini reddeder', () =>
    expect(parseMovieId('99999999999999999999')).toBeNull())
})
