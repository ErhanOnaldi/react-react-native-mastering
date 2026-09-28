import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MovieCatalog } from '@exercise/MovieCatalog'

describe('film kataloğu', () => {
  it('arama değişip liste kısalıp uzasa da favori doğru filmde kalır', async () => {
    const user = userEvent.setup()
    render(<MovieCatalog />)
    await user.type(screen.getByLabelText('Film ara'), 'Matrix')
    await user.click(screen.getByRole('button', { name: 'Matrix favori' }))
    expect(screen.getByRole('button', { name: 'Matrix favori' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.clear(screen.getByLabelText('Film ara'))
    expect(await screen.findByRole('button', { name: 'Matrix favori' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('sıralama yönü değişince favori başka bir filme kaymaz', async () => {
    const user = userEvent.setup()
    render(<MovieCatalog />)
    await user.click(screen.getByRole('button', { name: 'Dövüş Kulübü favori' }))
    expect(screen.getByRole('button', { name: 'Dövüş Kulübü favori' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(screen.getByRole('button', { name: 'Sırala' }))
    expect(screen.getByRole('button', { name: 'Dövüş Kulübü favori' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
