import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { movieQueries } from '@project/src/features/movies/api/movie-queries'

const root = process.env.RM_PROJECT_DIR!
function source(path: string) {
  return readFileSync(join(root, path), 'utf8')
}
function movieComponents() {
  const dir = join(root, 'src/features/movies/components')
  return existsSync(dir)
    ? readdirSync(dir)
        .filter((name) => name.endsWith('.tsx'))
        .map((name) => readFileSync(join(dir, name), 'utf8'))
        .join('\n')
    : ''
}

describe('trend ve detay prefetch', () => {
  it('ana sayfa sonsuz sorgunun sayfalarını birleştirir', () => {
    const home = source('src/pages/HomePage.tsx')
    expect(home).toMatch(/useInfiniteQuery/)
    expect(home).toMatch(/fetchNextPage/)
    expect(home).toMatch(/\.pages/)
  })

  it('film kartında hover ile detay prefetch başlatır', () => {
    const cards = movieComponents()
    expect(cards).toMatch(/onMouseEnter|onPointerEnter|onMouseOver/)
    expect(cards).toMatch(/prefetchQuery/)
  })

  it('prefetch edilen taze detay yeniden istek atmadan okunur', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    await client.prefetchQuery(movieQueries.detail(550))
    expect((await client.fetchQuery(movieQueries.detail(550))).title).toBe('Dövüş Kulübü')
    expect(requests('/3/movie/550'), 'Beklenen: hover ve detay toplam 1 istek').toHaveLength(1)
  })
})
