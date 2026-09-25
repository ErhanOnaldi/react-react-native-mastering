import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FavoritesProvider, useFavorites } from '@exercise/FavoritesContext'
function Reader() {
  const ids = useFavorites()
  return <p>{ids.join(',')}</p>
}
describe('FavoritesContext', () => {
  it('provider altındaki tüketiciye favori idlerini verir', () => {
    render(
      <FavoritesProvider>
        <Reader />
      </FavoritesProvider>,
    )
    expect(screen.getByText('550')).toBeInTheDocument()
  })
  it('provider dışında açıklayıcı hata verir', () => {
    expect(() => render(<Reader />)).toThrow(/FavoritesProvider/)
  })
})
