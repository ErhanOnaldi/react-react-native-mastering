import { describe, expect, it } from 'vitest'
import { formatDate, formatVote, releaseYear } from './format'

describe('film biçimleme', () => {
  it('puanı tek ondalıkla gösterir', () => {
    expect(formatVote(8)).toBe('8.0')
  })

  it('oy yoksa açıklayıcı metin gösterir', () => {
    expect(formatVote(0)).toBe('Henüz oy yok')
  })

  it('boş yayın tarihinden yıl üretmez', () => {
    expect(releaseYear('')).toBe('')
  })

  it('boş tarih için yer tutucu gösterir', () => {
    expect(formatDate('')).toBe('Tarih yok')
  })
})
