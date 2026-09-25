import type { TmdbListMovie } from '@test-utils'
export function makeMovie(overrides: Partial<TmdbListMovie> = {}): TmdbListMovie {
  return {
    id: 550,
    title: 'Dövüş Kulübü',
    original_title: 'Fight Club',
    overview: '',
    poster_path: '/poster.jpg',
    backdrop_path: null,
    release_date: '1999-10-15',
    genre_ids: [18],
    popularity: 10,
    vote_average: 8.4,
    vote_count: 100,
    adult: false,
    original_language: 'en',
    video: false,
    ...overrides,
  }
}
