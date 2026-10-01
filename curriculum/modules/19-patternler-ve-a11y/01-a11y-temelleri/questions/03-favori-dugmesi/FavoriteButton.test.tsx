import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FavoriteButton } from '@exercise/FavoriteButton'

describe('Favori düğmesi', () => {
  it('favori değilken Favori adlı, basılı olmayan bir düğmedir', () => {
    render(<FavoriteButton isFavorite={false} onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: 'Favori' })).toHaveAttribute('type', 'button')
    expect(screen.getByRole('button', { name: 'Favori' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('favoriyken adı değişmez, yalnızca basılı durumu değişir', () => {
    render(<FavoriteButton isFavorite onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: 'Favori' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('yıldız simgesi erişilebilirlik ağacından gizlidir', () => {
    render(<FavoriteButton isFavorite onToggle={() => {}} />)
    expect(screen.getByText('★')).toHaveAttribute('aria-hidden', 'true')
  })

  it('Tab ile ulaşılır; Enter ve Space her biri işlemi bir kez çağırır', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />)
    await user.tab()
    expect(screen.getByRole('button', { name: 'Favori' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onToggle).toHaveBeenCalledTimes(1)
    await user.keyboard(' ')
    expect(onToggle).toHaveBeenCalledTimes(2)
  })
})
