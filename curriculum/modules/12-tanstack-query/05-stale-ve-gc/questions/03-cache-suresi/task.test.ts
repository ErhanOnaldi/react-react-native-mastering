import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { detailOptions } from '@exercise/cachePolicy'
describe('cache saatleri', () => {
  it('aynı taze filmi iki okumada tek GET ile getirir', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    expect((await client.fetchQuery(detailOptions(550))).title).toBe('Dövüş Kulübü')
    await client.fetchQuery(detailOptions(550))
    expect(requests('/3/movie/550'), 'Beklenen: 1 istek').toHaveLength(1)
  })
  it('tazelik ve kullanılmayan cache ömrünü ayrı ayarlar', () => {
    expect(detailOptions(550).staleTime).toBe(60_000)
    expect(detailOptions(550).gcTime).toBe(300_000)
  })
  it('farklı film idleri için ayrı istek atar', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await client.fetchQuery(detailOptions(550))
    await client.fetchQuery(detailOptions(27205))
    expect(requests('/3/movie/550')).toHaveLength(1)
    expect(requests('/3/movie/27205')).toHaveLength(1)
  })
})
