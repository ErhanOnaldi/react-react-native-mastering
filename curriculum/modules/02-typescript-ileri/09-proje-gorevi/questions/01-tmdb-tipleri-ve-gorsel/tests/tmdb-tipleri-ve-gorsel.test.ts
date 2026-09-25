import { describe, expect, expectTypeOf, it } from 'vitest'
import { posterUrl } from '@project/src/lib/tmdb-image'
import type { ImageSize } from '@project/src/lib/tmdb-image'
import type {
  Movie,
  Genre,
  MovieDetails,
  CastMember,
  CrewMember,
  Video,
  Paginated,
  MovieListResponse,
} from '@project/src/types/tmdb'

describe('TMDB tip sözleşmesi', () => {
  it('liste cevabı generic sayfalama kabuğunu kullanır', () => {
    expectTypeOf<MovieListResponse>().toEqualTypeOf<Paginated<Movie>>()
    expectTypeOf<Paginated<Genre>['results']>().toEqualTypeOf<Genre[]>()
    expectTypeOf<Genre>().toMatchTypeOf<{ id: number; name: string }>()
  })
  it('detay, listeye özgü genre_ids alanını kaldırıp genres ve runtime ekler', () => {
    expectTypeOf<MovieDetails>().toExtend<Omit<Movie, 'genre_ids'>>()
    expectTypeOf<MovieDetails['genres']>().toEqualTypeOf<Genre[]>()
    expectTypeOf<MovieDetails['runtime']>().toEqualTypeOf<number | null>()
    expectTypeOf<MovieDetails['tagline']>().toEqualTypeOf<string>()
    expectTypeOf<MovieDetails['status']>().toEqualTypeOf<string>()
    expectTypeOf<MovieDetails['budget']>().toEqualTypeOf<number>()
    expectTypeOf<MovieDetails['revenue']>().toEqualTypeOf<number>()
    expectTypeOf<'genre_ids' extends keyof MovieDetails ? true : false>().toEqualTypeOf<false>()
  })
  it('eklenebilir kadro ve video cevaplarını tipleştirir', () => {
    expectTypeOf<MovieDetails['credits']>().toEqualTypeOf<
      { cast: CastMember[]; crew: CrewMember[] } | undefined
    >()
    expectTypeOf<MovieDetails['videos']>().toEqualTypeOf<{ results: Video[] } | undefined>()
    expectTypeOf<CastMember>().toMatchTypeOf<{
      id: number
      name: string
      character: string
      profile_path: string | null
      order: number
    }>()
    expectTypeOf<CrewMember>().toMatchTypeOf<{
      id: number
      name: string
      job: string
      department: string
      profile_path: string | null
    }>()
    expectTypeOf<Video>().toMatchTypeOf<{
      id: string
      key: string
      name: string
      site: string
      type: string
      official: boolean
      size: number
      published_at: string
    }>()
  })
})
describe('posterUrl', () => {
  it('boyut union’ını yalnız dört TMDB seçeneğiyle sınırlar', () => {
    expectTypeOf<ImageSize>().toEqualTypeOf<'w185' | 'w342' | 'w500' | 'original'>()
  })
  it('varsayılan w342 ve seçilen boyutla tek slash içeren URL kurar', () => {
    expect(posterUrl('/abc.jpg')).toBe('https://image.tmdb.org/t/p/w342/abc.jpg')
    expect(posterUrl('/abc.jpg', 'w185')).toBe('https://image.tmdb.org/t/p/w185/abc.jpg')
    expect(posterUrl('/abc.jpg', 'original')).toBe('https://image.tmdb.org/t/p/original/abc.jpg')
  })
  it('poster yolu null olduğunda undefined döndürür', () => {
    expect(posterUrl(null)).toBeUndefined()
  })
})
