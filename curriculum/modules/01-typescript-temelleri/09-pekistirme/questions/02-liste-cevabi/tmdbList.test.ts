import { describe, expect, expectTypeOf, it } from 'vitest'
import { pageTitles } from '@exercise/tmdbList'
import type { Movie, MovieListResponse } from '@exercise/tmdbList'

describe('MovieListResponse', () => {
  it('sonuç başlıklarını sırayla döner', () => { expect(pageTitles({ page: 1, results: [{ id: 550, title: 'Dövüş Kulübü', poster_path: null, release_date: '' }], total_pages: 2, total_results: 21 })).toEqual(['Dövüş Kulübü']) })
  it('boş sonuçta boş dizi döner', () => { expect(pageTitles({ page: 2, results: [], total_pages: 2, total_results: 21 })).toEqual([]) })
  it('sonuçların Movie dizisi olduğunu korur', () => { expectTypeOf<MovieListResponse['results']>().toEqualTypeOf<Movie[]>(); expectTypeOf<Movie['poster_path']>().toEqualTypeOf<string | null>() })
})
