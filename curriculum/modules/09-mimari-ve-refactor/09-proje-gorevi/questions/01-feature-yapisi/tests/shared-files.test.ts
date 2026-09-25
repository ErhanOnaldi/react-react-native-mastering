import { describe, expect, it } from 'vitest'
import { formatDate, formatVote, releaseYear } from '@project/src/shared/lib/format'
import { posterUrl } from '@project/src/shared/lib/tmdb-image'

describe('taşınan ortak yardımcılar', () => {
  it('puan ve boş tarih davranışını korur', () => {
    expect(formatVote(0)).toBe('Henüz oy yok')
    expect(releaseYear('')).toBe('')
    expect(formatDate('')).toBe('Tarih yok')
  })

  it('poster yoksa URL üretmez, varsa istenen boyutu kullanır', () => {
    expect(posterUrl(null)).toBeUndefined()
    expect(posterUrl('/afis.jpg', 'w185')).toBe('https://image.tmdb.org/t/p/w185/afis.jpg')
  })
})
