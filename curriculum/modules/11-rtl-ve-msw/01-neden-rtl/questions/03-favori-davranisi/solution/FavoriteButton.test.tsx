import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FavoriteButton } from '@impl/FavoriteButton'
describe('FavoriteButton', () => {
  it('kullanıcı tıklayınca film id’sini bildirir', async () => {
    const onToggle = vi.fn()
    render(<FavoriteButton movieId={550} isFavorite={false} onToggle={onToggle} />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Favorilere ekle' }))
    expect(onToggle).toHaveBeenCalledWith(550)
  })
  it('favori durumunda butonun erişilebilir adı değişir', () => {
    render(<FavoriteButton movieId={550} isFavorite onToggle={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Favorilerden çıkar' })).toBeInTheDocument()
  })
})
