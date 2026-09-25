import { describe, expect, it } from 'vitest'
import { formatVote } from '@exercise/formatVote'

describe('formatVote', () => {
  it('puanı tek ondalığa yuvarlar (7.456 → "7.5")', () => {
    expect(formatVote(7.456)).toBe('7.5')
  })

  it('tam sayıda sondaki sıfırı korur (8 → "8.0")', () => {
    expect(formatVote(8)).toBe('8.0')
  })

  it('0 oyda "Henüz oy yok" döner', () => {
    expect(formatVote(0)).toBe('Henüz oy yok')
  })
})
