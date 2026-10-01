import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FavoriteButton } from '@exercise/FavoriteButton'
describe('FavoriteButton', () => {
  it('form içinde tıklanınca submit yapmadan onClick çalıştırır', async () => {
    const user = userEvent.setup()
    const click = vi.fn()
    const submit = vi.fn((e) => e.preventDefault())
    render(
      <form onSubmit={submit}>
        <FavoriteButton onClick={click}>Favori</FavoriteButton>
      </form>,
    )
    await user.click(screen.getByRole('button', { name: 'Favori' }))
    expect(click).toHaveBeenCalledOnce()
    expect(submit).not.toHaveBeenCalled()
  })
  it('disabled ve aria-pressed özelliklerini düğmeye geçirir', () => {
    render(
      <FavoriteButton disabled aria-pressed={true}>
        Favoride
      </FavoriteButton>,
    )
    expect(screen.getByRole('button', { name: 'Favoride' })).toBeDisabled()
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })
})
