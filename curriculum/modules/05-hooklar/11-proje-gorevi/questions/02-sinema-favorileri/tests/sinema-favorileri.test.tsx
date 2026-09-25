import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FavoritesProvider, useFavorites } from '@project/src/context/FavoritesContext'
function Reader() {
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites()
  return (
    <div>
      <p>{favoriteIds.join(',')}</p>
      <button type="button" onClick={() => toggleFavorite(550)}>
        {isFavorite(550) ? 'Favoriden çıkar' : 'Favoriye ekle'}
      </button>
    </div>
  )
}
describe('Sinema favori context sözleşmesi', () => {
  it('favoriyi ekler ve çıkarır', () => {
    localStorage.clear()
    render(
      <FavoritesProvider>
        <Reader />
      </FavoritesProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Favoriye ekle' }))
    expect(screen.getByText('550')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Favoriden çıkar' }))
    expect(screen.getByRole('button', { name: 'Favoriye ekle' })).toBeInTheDocument()
  })
  it('yeni provider mount edildiğinde favori kaybolmaz', () => {
    localStorage.clear()
    const view = render(
      <FavoritesProvider>
        <Reader />
      </FavoritesProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Favoriye ekle' }))
    view.unmount()
    render(
      <FavoritesProvider>
        <Reader />
      </FavoritesProvider>,
    )
    expect(screen.getByRole('button', { name: 'Favoriden çıkar' })).toBeInTheDocument()
  })
  it('provider dışında açıklayıcı hata verir', () => {
    expect(() => render(<Reader />)).toThrow(/Provider|provider/)
  })
})
