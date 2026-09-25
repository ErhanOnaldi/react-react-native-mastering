import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { queryClient } from '@project/src/shared/api/query-client'
import { movieQueries } from '@project/src/features/movies/api/movie-queries'

describe('Sinema Query altyapısı', () => {
  it('uygulama için bir QueryClient export eder', () => {
    expect(queryClient).toBeInstanceOf(QueryClient)
  })

  it('altı sorgu tarifini doğru key ailelerinde kurar', () => {
    expect(movieQueries.all).toEqual(['movies'])
    expect(movieQueries.trending(1).queryKey).not.toEqual(movieQueries.trending(2).queryKey)
    expect(movieQueries.discover({ genreId: 28, page: 1 }).queryKey).not.toEqual(
      movieQueries.discover({ genreId: 35, page: 1 }).queryKey,
    )
    expect(movieQueries.search({ query: 'Dövüş', page: 1 }).queryKey).not.toEqual(
      movieQueries.search({ query: 'Dövüş', page: 2 }).queryKey,
    )
    expect(movieQueries.detail(550).queryKey).not.toEqual(movieQueries.detail(27205).queryKey)
    expect(movieQueries.genres().queryKey).toBeDefined()
  })

  it('detayı mevcut API üzerinden alır ve taze cachede yeniden GET atmaz', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    expect((await client.fetchQuery(movieQueries.detail(550))).title).toBe('Dövüş Kulübü')
    await client.fetchQuery(movieQueries.detail(550))
    expect(requests('/3/movie/550'), 'Beklenen: 1 istek').toHaveLength(1)
  })
})
