import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FavoriteButton } from '@exercise/FavoriteButton'
describe('FavoriteButton', () => {
  it('basılı durumu ve erişilebilir adı birlikte değiştirir', () => {
    render(<FavoriteButton active />)
    expect(
      screen.getByRole('button', { name: 'Favorilerden çıkar', pressed: true }),
    ).toBeInTheDocument()
  })
  it('devre dışı niteliği ve durum class’ını taşır', () => {
    render(<FavoriteButton active={false} disabled />)
    expect(screen.getByRole('button', { name: 'Favoriye ekle' })).toBeDisabled()
    expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50')
  })
  it('hover, klavye odağı ve dark class’larını taşır', () => {
    render(<FavoriteButton active={false} />)
    expect(screen.getByRole('button')).toHaveClass(
      'hover:bg-sky-800',
      'focus-visible:outline-2',
      'dark:bg-sky-500',
    )
  })
  it('tıklamayı dışarıya bildirir', async () => {
    const onClick = vi.fn()
    render(<FavoriteButton active={false} onClick={onClick} />)
    await userEvent.setup().click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
