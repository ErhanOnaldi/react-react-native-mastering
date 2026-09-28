import { describe, expect, it } from 'vitest'
import { sortAndFilterMovies } from '@exercise/localizedMovies'

const movies = [
  { id: 1, title: 'Şule' },
  { id: 2, title: 'İpek' },
  { id: 3, title: 'Çetin' },
  { id: 4, title: 'Işık' },
]

describe('Türkçe film kataloğu', () => {
  it('Türkçe alfabeye göre sıralar', () => {
    expect(sortAndFilterMovies(movies, '').map((movie) => movie.title)).toEqual([
      'Çetin',
      'Işık',
      'İpek',
      'Şule',
    ])
  })

  it('Türkçe harflerin büyük ve küçük biçimlerini eşleştirir', () => {
    expect(sortAndFilterMovies(movies, ' ipek ').map((movie) => movie.title)).toEqual(['İpek'])
    expect(sortAndFilterMovies(movies, 'ışık').map((movie) => movie.title)).toEqual(['Işık'])
  })

  it('kaynak film dizisini değiştirmez', () => {
    sortAndFilterMovies(movies, '')
    expect(movies.map((movie) => movie.title)).toEqual(['Şule', 'İpek', 'Çetin', 'Işık'])
  })
})
