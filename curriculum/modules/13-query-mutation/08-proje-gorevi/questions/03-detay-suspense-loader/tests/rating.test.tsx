import { describe, expect, it } from 'vitest'
import { routes } from '@project/src/router'
import { queryClient } from '@project/src/shared/api/query-client'
import { movieQueries } from '@project/src/features/movies/api/movie-queries'
import { requests } from '@test-utils'
function findDetail(items: typeof routes): any {
  for (const item of items) {
    if (item.path === '/movie/:id' || item.path === 'movie/:id') return item
    if (item.children) {
      const found = findDetail(item.children)
      if (found) return found
    }
  }
}
describe('detay route yüklemesi', () => {
  it('loader film verisini aynı query key’ine hazırlar', async () => {
    const route = findDetail(routes)
    expect(route?.loader).toBeTypeOf('function')
    queryClient.removeQueries({ queryKey: movieQueries.detail(550).queryKey })
    await route.loader({
      params: { id: '550' },
      request: new Request('http://localhost/movie/550'),
      context: {},
      matches: [],
    })
    expect(queryClient.getQueryData(movieQueries.detail(550).queryKey)).toMatchObject({
      id: 550,
      title: 'Dövüş Kulübü',
    })
    expect(requests('/3/movie/550')).toHaveLength(1)
  })
  it('geçersiz id için detay GET’i başlatmaz', async () => {
    const route = findDetail(routes)
    await expect(
      route.loader({
        params: { id: 'abc' },
        request: new Request('http://localhost/movie/abc'),
        context: {},
        matches: [],
      }),
    ).rejects.toThrow()
    expect(requests('/3/movie/abc')).toHaveLength(0)
  })
})
