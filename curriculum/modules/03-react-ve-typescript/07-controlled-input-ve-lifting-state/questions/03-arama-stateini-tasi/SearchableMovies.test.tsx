import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SearchableMovies } from '@exercise/SearchableMovies'
describe('SearchableMovies', () => {
  it('yazılan başlığa göre listeyi filtreler', async () => {
    const user = userEvent.setup()
    render(<SearchableMovies />)
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'kara')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Kara Şövalye')).toBeInTheDocument()
  })
  it('arama temizlenince filmleri geri getirir', async () => {
    const user = userEvent.setup()
    render(<SearchableMovies />)
    const input = screen.getByRole('textbox', { name: 'Film ara' })
    await user.type(input, 'Matrix')
    await user.clear(input)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
  it('boş sonuç için mesaj gösterir', async () => {
    const user = userEvent.setup()
    render(<SearchableMovies />)
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'yok')
    expect(screen.getByText('Film bulunamadı')).toBeInTheDocument()
  })
})
