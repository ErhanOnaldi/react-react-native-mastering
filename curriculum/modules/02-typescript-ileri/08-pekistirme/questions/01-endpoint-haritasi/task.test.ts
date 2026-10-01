import { expect, expectTypeOf, it } from 'vitest'
import { readEndpoint } from '@exercise/task'
import type { EndpointMap, MovieDetails, Paginated, Movie } from '@exercise/task'
const list: Paginated<Movie> = {
  page: 1,
  results: [{ id: 155, title: 'Kara Şövalye' }],
  total_pages: 1,
  total_results: 1,
}
const responses: EndpointMap = {
  '/trending/movie/week': list,
  '/movie/popular': list,
  '/movie/550': { id: 550, title: 'Dövüş Kulübü', runtime: 139 },
}
it('detay yolunda detay tipi ve gerçek veriyi döndürür', () => {
  const detail = readEndpoint('/movie/550', responses)
  expect(detail.runtime).toBe(139)
  expectTypeOf(detail).toEqualTypeOf<MovieDetails>()
  expectTypeOf(detail).not.toBeAny()
})
it('liste yolunda sayfalı sonuç döndürür', () => {
  const page = readEndpoint('/trending/movie/week', responses)
  expect(page.results[0].title).toBe('Kara Şövalye')
  expectTypeOf(page).toEqualTypeOf<Paginated<Movie>>()
  expectTypeOf(page).not.toBeAny()
})
