import type { TmdbListMovie } from '@test-utils'
export function makeMovie(overrides: Partial<TmdbListMovie> = {}): TmdbListMovie {
  return {
    id: 550,
    title: 'Dövüş Kulübü',
    original_title: 'Fight Club',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    release_date: '',
    genre_ids: [],
    popularity: 0,
    vote_average: 0,
    vote_count: 0,
    adult: false,
    original_language: 'en',
    video: false,
  }
}
