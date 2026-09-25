import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { loadMovieTitle } from '@exercise/loadMovieTitle'
describe('queryOptions tip çıkarımı', () => {
  it('önceden getirilen detaydan Türkçe başlığı döndürür', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    expect(await loadMovieTitle(client, 550)).toBe('Dövüş Kulübü')
    expect(requests('/3/movie/550')).toHaveLength(1)
  })
  it('aynı taze detay için ikinci istek atmaz', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await loadMovieTitle(client, 550)
    await loadMovieTitle(client, 550)
    expect(requests('/3/movie/550')).toHaveLength(1)
  })
})
