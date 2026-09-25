import { describe, expect, it } from 'vitest'
import { movieLabel } from '@exercise/movieLabel'

describe('movieLabel', () => {
  it.each([
    [{ title: 'Dövüş Kulübü', release_date: '1999-10-15' }, 'Dövüş Kulübü (1999)'],
    [{ title: ' Matrix ', release_date: '1999-03-31' }, 'Matrix (1999)'],
    [{ title: 'Yeni Film', release_date: '' }, 'Yeni Film'],
  ])('%s filminde kart etiketini %s olarak gösterir', (movie, expected) => {
    expect(movieLabel(movie)).toBe(expected)
  })
})
