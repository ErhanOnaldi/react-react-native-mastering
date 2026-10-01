import { describe, expect, expectTypeOf, it } from 'vitest'
import type {
  CastMember,
  CrewMember,
  Genre,
  Movie,
  MovieDetails,
  Video,
} from '@project/src/features/movies/types'
import { z } from 'zod'
import { catalog, TMDB_BASE } from '@test-utils'
import {
  movieSchema,
  movieListSchema,
  movieDetailsSchema,
} from '@project/src/features/movies/api/schemas'

describe('Sinema film şemaları', () => {
  it('film tiplerini şemaların çıktılarından türetir', () => {
    expectTypeOf<Movie>().toEqualTypeOf<z.infer<typeof movieSchema>>()
    expectTypeOf<MovieDetails>().toEqualTypeOf<z.infer<typeof movieDetailsSchema>>()
    expectTypeOf<Genre>().toEqualTypeOf<z.infer<typeof movieDetailsSchema>['genres'][number]>()
    expectTypeOf<CastMember>().toEqualTypeOf<
      NonNullable<z.infer<typeof movieDetailsSchema>['credits']>['cast'][number]
    >()
    expectTypeOf<CrewMember>().toEqualTypeOf<
      NonNullable<z.infer<typeof movieDetailsSchema>['credits']>['crew'][number]
    >()
    expectTypeOf<Video>().toEqualTypeOf<
      NonNullable<z.infer<typeof movieDetailsSchema>['videos']>['results'][number]
    >()
  })

  it('Türkçe TMDB listesini doğrular', () => {
    expect(
      movieListSchema.parse({
        page: 1,
        results: catalog.slice(0, 2),
        total_pages: 1,
        total_results: 2,
      }).results.length,
    ).toBe(2)
  })
  it('Dövüş Kulübü detayını doğrular', async () => {
    const response = await fetch(`${TMDB_BASE}/movie/550`, {
      headers: { Authorization: 'Bearer test-token' },
    })
    expect(movieDetailsSchema.parse(await response.json()).title).toBe('Dövüş Kulübü')
  })
  it('null posterin gerçek API değeri olduğunu bilir', () => {
    const item = { ...catalog[0], poster_path: null }
    expect(movieSchema.safeParse(item).success).toBe(true)
  })
  it('null başlığı liste ve detayda reddeder', () => {
    expect(movieSchema.safeParse({ ...catalog[0], title: null }).success).toBe(false)
    expect(movieSchema.safeParse({ ...catalog[0], title: '' }).success).toBe(false)
    expect(
      movieDetailsSchema.safeParse({
        ...catalog[0],
        runtime: 120,
        genres: [],
        tagline: '',
        status: 'Released',
        budget: 0,
        revenue: 0,
        title: null,
      }).success,
    ).toBe(false)
  })
})
