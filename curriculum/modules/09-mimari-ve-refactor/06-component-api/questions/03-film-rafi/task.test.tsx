import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MovieShelf } from '@exercise/MovieShelf'

describe('MovieShelf', () => {
  it('controlled kapalı raf tıklanınca sahibine açılma isteği bildirir', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <MovieShelf title="Favoriler" open={false} onOpenChange={onOpenChange}>
        <p>Dövüş Kulübü</p>
      </MovieShelf>,
    )
    await user.click(screen.getByRole('button', { name: 'Favoriler' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByText('Dövüş Kulübü')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Favoriler' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    rerender(
      <MovieShelf title="Favoriler" open onOpenChange={onOpenChange}>
        <p>Dövüş Kulübü</p>
      </MovieShelf>,
    )
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Favoriler' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})
