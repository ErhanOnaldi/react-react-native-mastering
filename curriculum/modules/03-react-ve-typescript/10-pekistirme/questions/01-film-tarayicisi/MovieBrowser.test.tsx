import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MovieBrowser } from '@exercise/MovieBrowser'
describe('MovieBrowser', () => {
  it('arama sonucunu başlığa göre daraltır', async () => {
    const user = userEvent.setup()
    render(<MovieBrowser />)
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'kara')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('Kara Şövalye')).toBeInTheDocument()
  })
  it('favori işaretini filtre kapanıp açılınca korur', async () => {
    const user = userEvent.setup()
    render(<MovieBrowser />)
    await user.click(screen.getByRole('button', { name: 'Matrix Favoriye ekle' }))
    const input = screen.getByRole('textbox', { name: 'Film ara' })
    await user.type(input, 'Kara')
    await user.clear(input)
    expect(screen.getByRole('button', { name: 'Matrix Favoriden çıkar' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
  it('boş aramada açıklayıcı mesaj gösterir', async () => {
    const user = userEvent.setup()
    render(<MovieBrowser />)
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'olmayan')
    expect(screen.getByText('Film bulunamadı')).toBeInTheDocument()
  })
})
