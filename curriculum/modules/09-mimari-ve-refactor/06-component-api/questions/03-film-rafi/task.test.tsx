import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MovieShelf } from '@exercise/MovieShelf'

describe('MovieShelf', () => {
  it('defaultOpen ile başlayıp kendi içinde açılıp kapanır', async () => {
    const user = userEvent.setup()
    render(
      <MovieShelf title="Trend" defaultOpen>
        <p>Matrix</p>
      </MovieShelf>,
    )
    expect(screen.getByText('Matrix')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Trend' }))
    expect(screen.queryByText('Matrix')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Trend' })).toHaveAttribute('aria-expanded', 'false')
  })
  it('controlled modda tıklama sahibine haber verir ama prop değişmeden görünümü değiştirmez', async () => {
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
    rerender(
      <MovieShelf title="Favoriler" open onOpenChange={onOpenChange}>
        <p>Dövüş Kulübü</p>
      </MovieShelf>,
    )
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
  })
})
