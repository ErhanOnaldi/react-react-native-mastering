import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { ThemeToggle } from '@exercise/ThemeToggle'

afterEach(() => document.documentElement.classList.remove('dark'))

describe('ThemeToggle', () => {
  it('açık temadan koyu temaya ve tekrar geri geçer', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const darkButton = screen.getByRole('button', { name: 'Koyu temaya geç' })
    expect(darkButton).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement).not.toHaveClass('dark')

    await user.click(darkButton)
    const lightButton = screen.getByRole('button', { name: 'Açık temaya geç' })
    expect(lightButton).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement).toHaveClass('dark')

    await user.click(lightButton)
    expect(screen.getByRole('button', { name: 'Koyu temaya geç' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(document.documentElement).not.toHaveClass('dark')
  })
})
