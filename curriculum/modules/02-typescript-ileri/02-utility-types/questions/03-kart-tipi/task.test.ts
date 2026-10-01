import { describe, expect, expectTypeOf, it } from 'vitest'
import { cardLine, cardLines } from '@exercise/task'
import type { MovieCardData } from '@exercise/task'
import type { Movie } from '@exercise/movie'

const fightClub: Movie = {
  id: 550,
  title: 'Dövüş Kulübü',
  original_title: 'Fight Club',
  overview: '',
  poster_path: null,
  backdrop_path: null,
  release_date: '1999-10-15',
  genre_ids: [18],
  vote_average: 8.438,
  vote_count: 30000,
  popularity: 60,
  adult: false,
  original_language: 'en',
  video: false,
}

const darkKnight: Movie = {
  ...fightClub,
  id: 155,
  title: 'Kara Şövalye',
  original_title: 'The Dark Knight',
  poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  vote_average: 8.52,
}

describe('film kartı', () => {
  it('kart tipi Movie ile aynı dört alanı, aynı tiplerle taşır', () => {
    expectTypeOf<MovieCardData>().toEqualTypeOf<{
      id: number
      title: string
      poster_path: string | null
      vote_average: number
    }>()
  })

  it('kart yalnızca dört alanlık bir nesneyle de çağrılabilir', () => {
    expect(
      cardLine({ id: 155, title: 'Kara Şövalye', poster_path: '/p.jpg', vote_average: 8.52 }),
    ).toBe('Kara Şövalye · 8.5')
  })

  it('posteri olmayan filmde satırın sonuna "poster yok" ekler', () => {
    expect(
      cardLine({ id: 550, title: 'Dövüş Kulübü', poster_path: null, vote_average: 8.438 }),
    ).toBe('Dövüş Kulübü · 8.4 · poster yok')
  })

  it('tam Movie listesinden kart satırlarını üretir', () => {
    expect(cardLines([darkKnight, fightClub])).toEqual([
      'Kara Şövalye · 8.5',
      'Dövüş Kulübü · 8.4 · poster yok',
    ])
  })
})
