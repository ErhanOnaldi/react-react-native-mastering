import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { requests, server, http, HttpResponse, TMDB_BASE } from '@test-utils'
import { SearchStatus } from '@exercise/SearchStatus'
const show = (query: string) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <SearchStatus query={query} />
    </QueryClientProvider>,
  )
}
describe('arama durumları', () => {
  it('Türkçe film sonucunu gösterir', async () => {
    show('Dövüş')
    expect(await screen.findByText('Dövüş Kulübü')).toBeInTheDocument()
    expect(requests('/3/search/movie')).toHaveLength(1)
  })
  it('sonuç yoksa boş durumu gösterir', async () => {
    show('olmayanfilmxyz')
    expect(await screen.findByText('Sonuç yok')).toBeInTheDocument()
  })
  it('sunucu hatasında açıklayıcı uyarı gösterir', async () => {
    server.use(http.get(`${TMDB_BASE}/search/movie`, () => HttpResponse.json({}, { status: 500 })))
    show('Dövüş')
    expect(await screen.findByRole('alert')).toHaveTextContent('Arama yüklenemedi')
  })
})
