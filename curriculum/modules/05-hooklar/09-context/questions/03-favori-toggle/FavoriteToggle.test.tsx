import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Provider, FavoriteToggle } from '@exercise/FavoriteToggle'
describe('FavoriteToggle', () => {
  it('favori ekleyip çıkarınca iki tüketici birlikte güncellenir', () => {
    render(
      <Provider>
        <FavoriteToggle id={550} />
        <FavoriteToggle id={550} />
      </Provider>,
    )
    fireEvent.click(screen.getAllByRole('button', { name: 'Favoriye ekle' })[0])
    expect(screen.getAllByRole('button', { name: 'Favoriden çıkar' })).toHaveLength(2)
    fireEvent.click(screen.getAllByRole('button', { name: 'Favoriden çıkar' })[0])
    expect(screen.getAllByRole('button', { name: 'Favoriye ekle' })).toHaveLength(2)
  })
})
