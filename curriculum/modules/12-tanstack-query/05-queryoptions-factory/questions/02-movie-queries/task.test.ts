import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, expectTypeOf } from 'vitest'
import { requests } from '@test-utils'
import { movieQueries } from '@exercise/movieQueries'
describe('tipli sorgu tarifleri', () => {
  it('detay seçenekleri aynı id için önceden getirilebilir', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const movie = await client.fetchQuery(movieQueries.detail(550))
    expect(movie.title).toBe('Dövüş Kulübü')
    expect(requests('/3/movie/550')).toHaveLength(1)
    expect(movieQueries.detail(550).queryKey).toEqual(['movies', 'detail', 550])
  })
  it('arama seçenekleri query ve page değerlerini taşır', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const page = await client.fetchQuery(movieQueries.search('Dövüş', 1))
    expect(page.results.some((m) => m.title === 'Dövüş Kulübü')).toBe(true)
    expect(requests('/3/search/movie')[0].search.get('query')).toBe('Dövüş')
    expect(movieQueries.search('Dövüş', 2).queryKey).not.toEqual(
      movieQueries.search('Dövüş', 1).queryKey,
    )
  })
  it('queryOptions sonuç tipini çıkarır', () => {
    const options = movieQueries.detail(550)
    expectTypeOf<Awaited<ReturnType<NonNullable<typeof options.queryFn>>>>().toEqualTypeOf<{
      id: number
      title: string
    }>()
  })
})
