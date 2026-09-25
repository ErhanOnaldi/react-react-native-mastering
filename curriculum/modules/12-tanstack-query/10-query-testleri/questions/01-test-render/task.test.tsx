import { useQuery } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithQuery } from '@exercise/renderWithQuery'
function Film() {
  const result = useQuery({
    queryKey: ['film', 550],
    queryFn: async () => {
      const response = await fetch('https://api.themoviedb.org/3/movie/550', {
        headers: { Authorization: 'Bearer test-token' },
      })
      return response.json() as Promise<{ title: string }>
    },
  })
  return <p>{result.data?.title ?? 'Bekleniyor'}</p>
}
describe('test render yardımcısı', () => {
  it('her çağrıda yeni QueryClient verir', () => {
    const first = renderWithQuery(<Film />)
    const second = renderWithQuery(<Film />)
    expect(first.client).not.toBe(second.client)
  })
  it('testte retry değerini kapatır', () => {
    const view = renderWithQuery(<Film />)
    expect(view.client.getDefaultOptions().queries?.retry).toBe(false)
  })
  it('provider içindeki film sonucunu gösterir', async () => {
    renderWithQuery(<Film />)
    expect(await screen.findAllByText('Dövüş Kulübü')).toHaveLength(1)
  })
})
