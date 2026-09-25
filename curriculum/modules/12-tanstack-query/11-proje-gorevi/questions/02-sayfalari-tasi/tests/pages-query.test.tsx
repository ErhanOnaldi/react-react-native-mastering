import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { movieQueries } from '@project/src/features/movies/api/movie-queries'

const root = process.env.RM_PROJECT_DIR!
function source(page: string) {
  return readFileSync(join(root, 'src/pages', page), 'utf8')
}

describe('Sinema sayfalarının Query geçişi', () => {
  it('dört sayfa Query sorguları ile sunucu verisini okur', () => {
    for (const file of [
      'HomePage.tsx',
      'SearchPage.tsx',
      'MovieDetailsPage.tsx',
      'FavoritesPage.tsx',
    ]) {
      expect(source(file)).toMatch(/useQuery|useQueries|useInfiniteQuery/)
    }
  })

  it('arama ve keşif için URL parametreleri farklı cache keyleri üretir', () => {
    expect(movieQueries.search({ query: 'Matrix', page: 1 }).queryKey).not.toEqual(
      movieQueries.search({ query: 'Matrix', page: 2 }).queryKey,
    )
    expect(movieQueries.discover({ genreId: 28, page: 1 }).queryKey).not.toEqual(
      movieQueries.discover({ genreId: 35, page: 1 }).queryKey,
    )
  })

  it('aramaya geri dönerken aynı taze sonuç için ikinci GET atmaz', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const options = movieQueries.search({ query: 'Dövüş', page: 1 })
    const first = await client.fetchQuery(options)
    expect(first.results.some((movie) => movie.title === 'Dövüş Kulübü')).toBe(true)
    await client.fetchQuery(options)
    expect(requests('/3/search/movie'), 'Beklenen: 1 istek').toHaveLength(1)
  })

  it('sayfalama geçişinde v5 placeholderData kullanır', () => {
    expect(source('SearchPage.tsx') + source('HomePage.tsx')).toMatch(/keepPreviousData/)
  })
})
