import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { searchMovies } from '@exercise/searchMovies'
import { buildSearchUrl } from '@exercise/buildSearchUrl'

describe('arama refactor', () => {
  it('ilk sayfada Türkçe başlığı bulur', async () => {
    const page = await searchMovies('Dövüş', 1, 'test-token')
    expect(page.page).toBe(1)
    expect(page.results.some((m) => m.title === 'Dövüş Kulübü')).toBe(true)
  })
  it('ikinci sayfayı ayrı istek olarak gönderir', async () => {
    const page = await searchMovies('a', 2, 'test-token')
    expect(page.page).toBe(2)
    expect(requests('/3/search/movie')[0].search.get('page')).toBe('2')
  })
  it('Türkçe karakteri query parametresinde korur', async () => {
    await searchMovies('Dövüş Kulübü', 1, 'test-token')
    expect(requests('/3/search/movie')[0].search.get('query')).toBe('Dövüş Kulübü')
  })
  it('ayrılan URL kurucusu sayfa ve Türkçe aramayı korur', () => {
    const url = new URL(buildSearchUrl('Dövüş Kulübü', 2))
    expect(url.pathname).toBe('/3/search/movie')
    expect(url.searchParams.get('language')).toBe('tr-TR')
    expect(url.searchParams.get('query')).toBe('Dövüş Kulübü')
    expect(url.searchParams.get('page')).toBe('2')
  })
})
