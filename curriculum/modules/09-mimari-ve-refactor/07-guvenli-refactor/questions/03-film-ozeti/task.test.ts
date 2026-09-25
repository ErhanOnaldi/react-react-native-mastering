import { describe, expect, it } from 'vitest'
import { describeMovie } from '@exercise/describeMovie'
import { formatMovieYear } from '@exercise/formatMovieYear'

describe('film özeti refactor', () => {
  it('trend başlığının davranışını korur', () => {
    expect(describeMovie({ title: 'Matrix', release_date: '1999-03-31' }, 'trending')).toBe(
      'Trend · Matrix · 1999',
    )
  })
  it('favoride boş tarih metnini korur', () => {
    expect(describeMovie({ title: 'Dövüş Kulübü', release_date: '' }, 'favorite')).toBe(
      'Favori · Dövüş Kulübü · Tarih yok',
    )
  })
  it('arama etiketini korur', () => {
    expect(describeMovie({ title: 'Başlangıç', release_date: '2010-07-16' }, 'search')).toBe(
      'Arama · Başlangıç · 2010',
    )
  })
  it('ayrılan yıl biçimleyicisi dolu ve boş tarihi ele alır', () => {
    expect(formatMovieYear('1999-03-31')).toBe('1999')
    expect(formatMovieYear('')).toBe('Tarih yok')
  })
})
