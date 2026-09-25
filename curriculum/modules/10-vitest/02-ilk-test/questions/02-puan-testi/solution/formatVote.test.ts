import { describe, expect, it } from 'vitest'
import { formatVote } from '@impl/formatVote'

describe('formatVote', () => {
  it('tam sayı puanı tek ondalıklı gösterir', () => {
    const vote = 8
    const shown = formatVote(vote)
    expect(shown).toBe('8.0')
  })

  it('oylanmamış filmi puansız olarak gösterir', () => {
    const shown = formatVote(0)
    expect(shown).toBe('Henüz oy yok')
  })
})
