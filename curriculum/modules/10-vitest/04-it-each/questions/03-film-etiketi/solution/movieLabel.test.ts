import { describe, expect, it } from 'vitest'
import { movieLabel } from '@impl/movieLabel'

describe('movieLabel', () => {
  it.each([
    [
      'tarihli Dövüş Kulübü',
      'Dövüş Kulübü (1999)',
      { title: 'Dövüş Kulübü', release_date: '1999-10-15' },
    ],
    ['boşluklu Matrix başlığı', 'Matrix (1999)', { title: ' Matrix ', release_date: '1999-03-31' }],
    ['tarihi olmayan Yeni Film', 'Yeni Film', { title: 'Yeni Film', release_date: '' }],
  ])('%s girdisi için %s etiketi üretir', (_label, expected, movie) => {
    expect(movieLabel(movie)).toBe(expected)
  })
})
